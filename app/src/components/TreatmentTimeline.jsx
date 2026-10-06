import React, { useMemo, useState } from "react";
import { fmtDate, searchText } from "../lib.js";
import Icon from "./Icon.jsx";
import { careMilestones } from "../clinical.js";
export default function TreatmentTimeline({ data, openId }) {
  const milestones = useMemo(() => careMilestones(data), [data]);
  const [query, setQuery] = useState(""),
    [hospital, setHospital] = useState(""),
    [order, setOrder] = useState("desc"),
    [mode, setMode] = useState("all");
  const groups = useMemo(() => {
    const dates = new Map();
    const get = (date) => {
      if (!dates.has(date)) dates.set(date, { date, events: [], reports: [] });
      return dates.get(date);
    };
    for (const e of milestones) get(e.date).events.push(e);
    for (const r of data.reports) get(r.date || "undated").reports.push(r);
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return [...dates.values()]
      .map((g) => ({
        ...g,
        events: g.events.filter(
          (e) =>
            (!hospital ||
              e.sources.some(
                (id) =>
                  data.reports.find((r) => r.id === id)?.hospital === hospital,
              )) &&
            words.every((w) =>
              (e.title + " " + e.detail).toLowerCase().includes(w),
            ),
        ),
        reports: g.reports.filter(
          (r) =>
            (!hospital || r.hospital === hospital) &&
            words.every((w) => searchText(r).includes(w)),
        ),
      }))
      .filter((g) =>
        mode === "milestones"
          ? g.events.length
          : g.events.length || g.reports.length,
      )
      .sort((a, b) =>
        a.date === "undated"
          ? 1
          : b.date === "undated"
            ? -1
            : a.date.localeCompare(b.date) * (order === "desc" ? -1 : 1),
      );
  }, [data, milestones, query, hospital, order, mode]);
  return (
    <div className="stack">
      <div className="timeline-summary">
        <div>
          <Icon name="timeline" size={24} />
          <span>
            <b>{milestones.length} care milestones</b>
            <small>April – October 2026</small>
          </span>
        </div>
        <div>
          <Icon name="file" size={24} />
          <span>
            <b>{data.reports.length} source records</b>
            <small>Including treatment charts & prescriptions</small>
          </span>
        </div>
        <div>
          <Icon name="heart" size={24} />
          <span>
            <b>Evidence at every step</b>
            <small>Click any report to inspect the original</small>
          </span>
        </div>
      </div>
      <div className="card toolbar">
        <div className="search-field">
          <Icon name="search" size={18} />
          <input
            type="search"
            aria-label="Search timeline"
            placeholder="Search treatments, investigations, medicines…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Timeline hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
        >
          <option value="">All hospitals</option>
          {[...new Set(data.reports.map((r) => r.hospital))].sort().map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <select
          aria-label="Timeline content"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="all">All records & milestones</option>
          <option value="milestones">Care milestones only</option>
        </select>
        <select
          aria-label="Timeline order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
      <div className="treatment-timeline">
        {groups.map((g) => (
          <section className="timeline-day" key={g.date}>
            <div className="timeline-date">
              <span className="day-dot" />
              <time>
                {g.date === "undated" ? "Date not recorded" : fmtDate(g.date)}
              </time>
              <small>{g.reports.length} records</small>
            </div>
            <div className="day-content">
              {g.events.map((e) => (
                <article className="timeline-event card" key={e.title}>
                  <span className="pill neutral">
                    {e.eventType || "Care milestone"}
                  </span>
                  <h2>{e.title}</h2>
                  <p>{e.detail}</p>
                  {e.sourceNote && (
                    <p className="muted small">Source: {e.sourceNote}</p>
                  )}
                  <div className="source-buttons">
                    {e.sources.map((id) => (
                      <button
                        className="btn ghost"
                        key={id}
                        onClick={() => openId(id)}
                      >
                        <Icon name="file" size={15} />
                        {id}
                        <Icon name="arrow" size={14} />
                      </button>
                    ))}
                  </div>
                </article>
              ))}
              {mode === "all" && g.reports.length > 0 && (
                <div className="day-reports card">
                  {g.reports.map((r) => (
                    <details className="timeline-record" key={r.id}>
                      <summary>
                        <span
                          className={
                            "report-type-icon " +
                            (/Prescription|Chart|Clinical/i.test(r.reportType)
                              ? "teal"
                              : "")
                          }
                        >
                          <Icon name="file" size={18} />
                        </span>
                        <span className="record-title">
                          <b>{r.title}</b>
                          <small>
                            {r.hospital} · {r.reportType} · {r.id}
                          </small>
                        </span>
                        <Icon name="plus" size={16} />
                      </summary>
                      <div className="timeline-record-detail">
                        <p>{r.summary}</p>
                        {r.keyPoints?.length > 0 && (
                          <ul>
                            {r.keyPoints.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        )}
                        {r.issues?.length > 0 && (
                          <div className="note">{r.issues.join(" · ")}</div>
                        )}
                        <button
                          className="text-action"
                          onClick={() => openId(r.id)}
                        >
                          View findings & original{" "}
                          <Icon name="arrow" size={16} />
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
              )}
              {g.events.some((e) => e.sources.includes("R-106")) && (
                <details className="card medication-timeline">
                  <summary>
                    Medication list documented on 3 October ·{" "}
                    {data.patient.medications.items.length} medicines
                  </summary>
                  <p className="muted small">
                    Historical chart. Later medication changes are not
                    documented.
                  </p>
                  <div className="medication-grid">
                    {data.patient.medications.items.map((m) => (
                      <div className="med-row" key={m.name}>
                        <div>
                          <b>{m.name}</b>
                          <small>{m.dose}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </section>
        ))}
      </div>
      {!groups.length && (
        <div className="card empty-state">
          <Icon name="search" size={30} />
          <h2>No timeline entries match</h2>
          <p>Try a different hospital or search term.</p>
          <button
            className="btn ghost"
            onClick={() => {
              setQuery("");
              setHospital("");
              setMode("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

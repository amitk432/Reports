import React, { useMemo, useState } from "react";
import { fmtDate, fileUrl, searchText } from "../lib.js";
import Icon from "./Icon.jsx";
const uniq = (xs) => [...new Set(xs)].filter(Boolean).sort();
function takeHospitalHint() {
  try {
    const h = sessionStorage.getItem("hospital") || "";
    sessionStorage.removeItem("hospital");
    return h;
  } catch {
    return "";
  }
}
const PAGE_SIZE = 15;
export default function ReportIndex({ reports, open }) {
  const [q, setQ] = useState(""),
    [hospital, setHospital] = useState(takeHospitalHint),
    [type, setType] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [abnormal, setAbnormal] = useState(false),
    [issues, setIssues] = useState(false),
    [sort, setSort] = useState("desc"),
    [page, setPage] = useState(1),
    [advanced, setAdvanced] = useState(false);
  const rows = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return reports
      .filter(
        (r) =>
          (!hospital || r.hospital === hospital) &&
          (!type || r.reportType === type) &&
          (!from || (r.date && r.date >= from)) &&
          (!to || (r.date && r.date <= to)) &&
          (!abnormal ||
            r.findings?.some((f) => ["H", "L", "C"].includes(f.flag))) &&
          (!issues || r.issues?.length) &&
          words.every((w) => searchText(r).includes(w)),
      )
      .sort((a, b) =>
        !a.date
          ? 1
          : !b.date
            ? -1
            : a.date.localeCompare(b.date) * (sort === "desc" ? -1 : 1) ||
              a.id.localeCompare(b.id),
      );
  }, [reports, q, hospital, type, from, to, abnormal, issues, sort]);
  const change = (setter, value) => {
    setter(value);
    setPage(1);
  };
  const reset = () => {
    setQ("");
    setHospital("");
    setType("");
    setFrom("");
    setTo("");
    setAbnormal(false);
    setIssues(false);
    setPage(1);
  };
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    current = Math.min(page, pages),
    shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return (
    <section className="stack">
      <div className="report-stats">
        <div>
          <span className="eyebrow">ORIGINAL DOCUMENTS</span>
          <b>
            {reports.length}
            <small>reports in your library</small>
          </b>
        </div>
        <div>
          <span className="eyebrow">HOSPITALS & LABS</span>
          <b>
            {uniq(reports.map((r) => r.hospital)).length}
            <small>sources connected</small>
          </b>
        </div>
        <a className="summary-shortcut" href="#summaries">
          <Icon name="heart" size={25} />
          <span>
            <b>Looking for the bigger picture?</b>
            <small>Open prepared care summaries</small>
          </span>
          <Icon name="arrow" size={20} />
        </a>
      </div>
      <div className="card report-toolbar">
        <div className="toolbar">
          <div className="search-field">
            <Icon name="search" size={19} />
            <input
              type="search"
              placeholder="Search a report, test, medicine, or doctor…"
              value={q}
              onChange={(e) => change(setQ, e.target.value)}
              aria-label="Search reports"
            />
          </div>
          <select
            aria-label="Hospital or lab"
            value={hospital}
            onChange={(e) => change(setHospital, e.target.value)}
          >
            <option value="">All hospitals & labs</option>
            {uniq(reports.map((r) => r.hospital)).map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <select
            aria-label="Report type"
            value={type}
            onChange={(e) => change(setType, e.target.value)}
          >
            <option value="">All report types</option>
            {uniq(reports.map((r) => r.reportType)).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            className={"btn ghost " + (advanced ? "selected" : "")}
            onClick={() => setAdvanced(!advanced)}
            aria-expanded={advanced}
          >
            More filters
          </button>
        </div>
        {advanced && (
          <div className="advanced-filters">
            <label>
              From date
              <input
                type="date"
                value={from}
                onChange={(e) => change(setFrom, e.target.value)}
              />
            </label>
            <label>
              To date
              <input
                type="date"
                value={to}
                onChange={(e) => change(setTo, e.target.value)}
              />
            </label>
            <label className="inline">
              <input
                type="checkbox"
                checked={abnormal}
                onChange={(e) => change(setAbnormal, e.target.checked)}
              />
              Abnormal results
            </label>
            <label className="inline">
              <input
                type="checkbox"
                checked={issues}
                onChange={(e) => change(setIssues, e.target.checked)}
              />
              Has transcription notes
            </label>
          </div>
        )}
      </div>
      <div className="results-heading">
        <p>
          <b>{rows.length}</b> reports{" "}
          <span className="muted">
            {rows.length === reports.length
              ? "· Your complete original record collection"
              : "match your filters"}
          </span>
        </p>
        <div className="actions">
          <button className="text-action" onClick={reset}>
            Reset filters
          </button>
          <select
            aria-label="Sort reports"
            value={sort}
            onChange={(e) => change(setSort, e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>
      <div className="report-library">
        <div className="library-head">
          <span>REPORT & SOURCE</span>
          <span>COLLECTED</span>
          <span>FINDINGS</span>
          <span>ACTIONS</span>
        </div>
        {shown.map((r) => {
          const flags = (r.findings || []).filter((f) =>
            ["H", "L", "C"].includes(f.flag),
          );
          return (
            <article className="report-row" key={r.id}>
              <button className="report-main" onClick={() => open(r, rows)}>
                <span
                  className={
                    "report-type-icon " +
                    (/Prescription|Chart|Clinical/i.test(r.reportType)
                      ? "teal"
                      : "")
                  }
                >
                  <Icon name="file" size={23} />
                </span>
                <span>
                  <b>{r.title}</b>
                  <small>{r.hospital}</small>
                  <span className="report-meta">
                    <span className="pill neutral">{r.reportType}</span>
                    <span>
                      {r.id}
                      {r.page ? " · Page " + r.page : ""}
                    </span>
                  </span>
                </span>
              </button>
              <time>
                {fmtDate(r.date)}
                {r.reportedDate && r.reportedDate !== r.date && (
                  <small>Reported {fmtDate(r.reportedDate)}</small>
                )}
              </time>
              <div className="report-highlights">
                {flags.length > 0 ? (
                  <>
                    <span
                      className={
                        "pill " +
                        (flags.some((f) => f.flag === "C")
                          ? "status-confirmed"
                          : "status-suspected")
                      }
                    >
                      {flags.length} flagged{" "}
                      {flags.length === 1 ? "result" : "results"}
                    </span>
                    <small>
                      {flags
                        .slice(0, 2)
                        .map((f) => `${f.test}: ${f.value}`)
                        .join(" · ")}
                    </small>
                  </>
                ) : (
                  <small className="report-excerpt">{r.summary}</small>
                )}
                {r.issues?.length > 0 && (
                  <span className="transcription-note">
                    {r.issues.length} transcription{" "}
                    {r.issues.length === 1 ? "note" : "notes"}
                  </span>
                )}
              </div>
              <div className="report-actions">
                <button className="btn ghost" onClick={() => open(r, rows)}>
                  View <Icon name="arrow" size={14} />
                </button>
                <a
                  className="icon-button"
                  href={fileUrl(r.path)}
                  download={r.path.split("/").pop()}
                  aria-label={`Download ${r.title}`}
                >
                  <Icon name="down" size={19} />
                </a>
              </div>
            </article>
          );
        })}
        {!rows.length && (
          <div className="empty-state">
            <Icon name="search" size={32} />
            <h2>No matching reports</h2>
            <p>Try another search term or reset your filters.</p>
            <button className="btn ghost" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </div>
      <div className="pagination">
        <span className="muted small">
          {rows.length
            ? `Showing ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, rows.length)} of ${rows.length}`
            : "0 reports"}
        </span>
        <div className="actions">
          <button
            className="btn ghost"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </button>
          <span className="small">
            Page {current} of {pages}
          </span>
          <button
            className="btn ghost"
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
const ClinicalScene = lazy(() => import("./ClinicalScene.jsx"));
import { DIAGRAMS, REGION_COLORS } from "../diagramClinical.js";
import Icon from "./Icon.jsx";
import { AREAS, loadMarks } from "../clinical.js";
import { fmtDate } from "../lib.js";

function MarkDialog({ area, reports, onSave, close }) {
  const dialog = useRef(null),
    [region, setRegion] = useState(area),
    [note, setNote] = useState(""),
    [source, setSource] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    dialog.current.showModal();
  }, []);
  const submit = (e) => {
    e.preventDefault();
    try {
      onSave({
        id: crypto.randomUUID(),
        area: region,
        note: note.trim(),
        source,
        created: new Date().toISOString(),
      });
      close();
    } catch {
      setError(
        "This browser could not save the note. Please enable local storage and try again.",
      );
    }
  };
  return (
    <dialog className="mark-dialog" ref={dialog} onClose={close}>
      <form onSubmit={submit}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR OBSERVATIONS</div>
            <h2>Add an area note</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close note form"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="muted">
          Record an observation or a question for the care team. Notes are saved
          on this device and are labeled as family notes.
        </p>
        <label>
          Finding area
          <select
            aria-label="Finding area"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Observation or question
          <textarea
            aria-label="Observation or question"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            maxLength={2000}
            placeholder="What would you like to discuss with the treating team?"
            rows={4}
          />
        </label>
        <label>
          Link a source report (optional)
          <select
            aria-label="Link a source report (optional)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">No source — personal observation</option>
            {[...reports]
              .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} · {fmtDate(r.date)} · {r.title}
                </option>
              ))}
          </select>
        </label>
        <div className="note small">
          A family note does not confirm an infection or its cause.
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions form-actions">
          <button className="btn ghost" type="button" onClick={close}>
            Cancel
          </button>
          <button className="btn" type="submit" disabled={!note.trim()}>
            <Icon name="check" size={16} />
            Save note
          </button>
        </div>
      </form>
    </dialog>
  );
}
export default function Portal({ data, openId, compact = false }) {
  const [active, setActive] = useState("brain"),
    [location, setLocation] = useState("cerebral"),
    [mode, setMode] = useState("locations"),
    [marks, setMarks] = useState(loadMarks),
    [adding, setAdding] = useState(false),
    [removeError, setRemoveError] = useState("");
  const area = AREAS.find((a) => a.id === active),
    diagram = DIAGRAMS[active];
  const selected =
    diagram.regions.find((r) => r.id === location) || diagram.regions[0];
  const choose = (id) => {
    setActive(id);
    setLocation(DIAGRAMS[id].regions[0].id);
  };
  const save = (mark) => {
    const next = [...marks, mark];
    localStorage.setItem("care-atlas-marks-v1", JSON.stringify(next));
    setMarks(next);
    choose(mark.area);
  };
  const remove = (id) => {
    try {
      const next = marks.filter((m) => m.id !== id);
      localStorage.setItem("care-atlas-marks-v1", JSON.stringify(next));
      setMarks(next);
    } catch {
      setRemoveError("This browser could not update saved notes.");
    }
  };
  return (
    <div className="portal-section focused-portal">
      <div className="section-heading portal-heading">
        <div>
          <div className="eyebrow">LOCATION · DAMAGE · CAUSE</div>
          <h2>3D damage & infection diagrams</h2>
        </div>
        <button className="btn ghost" onClick={() => setAdding(true)}>
          <Icon name="plus" size={16} />
          Add area note
        </button>
      </div>
      <div className="organ-tabs" aria-label="Choose a focused diagram">
        {[...AREAS]
          .sort((a, b) => (a.id === "brain" ? -1 : b.id === "brain" ? 1 : 0))
          .map((a) => (
            <button
              key={a.id}
              onClick={() => choose(a.id)}
              className={active === a.id ? "active" : ""}
              aria-pressed={active === a.id}
              aria-label={`Explore ${a.name}`}
            >
              <span className="area-dot" style={{ background: a.color }} />
              <span>
                <b>{a.name}</b>
                <small>{a.status}</small>
              </span>
            </button>
          ))}
      </div>
      <div className="portal-layout">
        <div className="portal-visual">
          <div className="portal-controls">
            <div className="segmented" aria-label="Diagram explanation">
              {[
                ["locations", "Locations"],
                ["process", "Damage process"],
                ["causes", "Possible causes"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setMode(v)}
                  className={mode === v ? "on" : ""}
                  aria-pressed={mode === v}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Suspense
            fallback={
              <div className="anatomy-stage scene-fallback">
                <Icon name="diagram" size={42} />
                <p>Loading focused diagram…</p>
              </div>
            }
          >
            <ClinicalScene
              area={active}
              selected={selected.id}
              onSelect={setLocation}
              mode={mode}
            />
          </Suspense>
          <div className="scene-legend">
            {mode === "process" &&
            ["brain", "blood", "heart"].includes(active) ? (
              <>
                <span>
                  <i style={{ background: "#d67372" }} />
                  Blood cells
                </span>
                <span>
                  <i
                    style={{
                      background: active === "blood" ? "#f0808c" : "#edba69",
                    }}
                  />
                  {active === "brain"
                    ? "Illustrative blockage"
                    : active === "blood"
                      ? "Illustrative bacteria"
                      : "Suspected vegetation"}
                </span>
                {active === "brain" && (
                  <span>
                    <i style={{ background: "#91b1a9" }} />
                    Downstream tissue
                  </span>
                )}
              </>
            ) : (
              [...new Set(diagram.regions.map((r) => r.kind))].map((kind) => (
                <span key={kind}>
                  <i style={{ background: REGION_COLORS[kind] }} />
                  {
                    {
                      infarct: "Acute infarct",
                      bleed: "Small haemorrhage",
                      chronic: "Chronic damage",
                      suspected: "Suspected vegetation",
                      infection: "Culture-confirmed infection",
                      historical: "Historical infection",
                    }[kind]
                  }
                </span>
              ))
            )}
          </div>
          <div className="diagram-boundary">
            <Icon name="info" size={17} />
            <p>{mode === "process" ? diagram.processNote : diagram.boundary}</p>
          </div>
        </div>
        <aside className="finding-panel">
          <div className="finding-panel-header">
            <h3>
              {mode === "locations"
                ? "Where is the finding?"
                : mode === "process"
                  ? "What happens here?"
                  : "Why might it happen?"}
            </h3>
          </div>
          {mode === "locations" ? (
            <>
              <div className="location-list">
                {diagram.regions.map((r, i) => (
                  <button
                    key={r.id}
                    className={selected.id === r.id ? "active" : ""}
                    aria-label={`Select location ${r.name}`}
                    aria-pressed={selected.id === r.id}
                    onClick={() => setLocation(r.id)}
                  >
                    <span style={{ "--region-color": REGION_COLORS[r.kind] }}>
                      {i + 1}
                    </span>
                    {r.name}
                    <Icon name="chevron" size={14} />
                  </button>
                ))}
              </div>
              <div className="location-detail" aria-live="polite">
                <div className="eyebrow">SELECTED REGION</div>
                <h3>{selected.name}</h3>
                <p>{selected.detail}</p>
              </div>
            </>
          ) : mode === "process" ? (
            <div className="process-explanation">
              <ol>
                {diagram.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {diagram.education && (
                <a
                  className="link"
                  href={diagram.education.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {diagram.education.title} <Icon name="arrow" size={14} />
                </a>
              )}
            </div>
          ) : (
            <div className="cause-explanation">
              {diagram.causes.map((c) => (
                <article key={c.title}>
                  <h4>{c.title}</h4>
                  <p>{c.text}</p>
                </article>
              ))}
            </div>
          )}
          <article className="finding-detail">
            <div className="finding-detail-top">
              <span className={"pill status-" + area.status.toLowerCase()}>
                {area.status}
              </span>
              <small>{fmtDate(area.date)}</small>
            </div>
            <h3>{area.title}</h3>
            <p>{area.detail}</p>
            <div className="evidence-heading">
              SOURCE EVIDENCE <span>{area.sources.length} reports</span>
            </div>
            {area.sources.map((id) => (
              <button
                className="evidence-link"
                key={id}
                onClick={() => openId(id)}
              >
                <Icon name="file" size={16} />
                <span>
                  <b>{data.reports.find((r) => r.id === id)?.title || id}</b>
                  <small>{id} · View original report</small>
                </span>
                <Icon name="arrow" size={15} />
              </button>
            ))}
            {marks
              .filter((m) => m.area === active)
              .map((m) => (
                <div className="family-note" key={m.id}>
                  <div>
                    <b>Family note</b>
                    <button
                      className="icon-button"
                      aria-label="Delete family note"
                      onClick={() => remove(m.id)}
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <p>{m.note}</p>
                  {m.source && (
                    <button className="link" onClick={() => openId(m.source)}>
                      Source {m.source}
                    </button>
                  )}
                  <small>
                    {new Date(m.created).toLocaleDateString("en-GB")}
                  </small>
                </div>
              ))}
            {removeError && <p role="alert">{removeError}</p>}
          </article>
        </aside>
      </div>
      <section className="diagram-progress card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              DATED EVIDENCE · {area.short.toUpperCase()}
            </div>
            <h3>What do we know about progression?</h3>
          </div>
          <span className="pill neutral">
            Latest evidence: {fmtDate(diagram.date)}
          </span>
        </div>
        <div className="progress-events">
          {diagram.history.map((event) => (
            <article key={event.date}>
              <time>{fmtDate(event.date)}</time>
              <h4>{event.title}</h4>
              <p>{event.text}</p>
              <div className="sources">
                {event.sources.map((id) => (
                  <button className="link" key={id} onClick={() => openId(id)}>
                    View {id} <Icon name="arrow" size={13} />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="current-unknown">
          <Icon name="clock" size={19} />
          <div>
            <b>Current change · not established</b>
            <p>{diagram.current}</p>
          </div>
        </div>
        {active === "brain" && (
          <p className="care-update">
            Family update · 7 October: admitted to BLK-Max ICU with ventilator
            support. This is a care-status update, not a measure of lesion
            progression.
          </p>
        )}
      </section>
      {!compact && (
        <section className="card diagnoses">
          <div className="eyebrow">COMPLETE CLINICAL CONTEXT</div>
          <h2>Conditions recorded in the reports</h2>
          {data.patient.diagnoses.map((d) => (
            <div className="diagnosis-row" key={d.text}>
              <p>{d.text}</p>
              <div className="sources">
                {d.sources.map((id) => (
                  <button className="link" key={id} onClick={() => openId(id)}>
                    {id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
      {adding && (
        <MarkDialog
          area={active}
          reports={data.reports}
          onSave={save}
          close={() => setAdding(false)}
        />
      )}
    </div>
  );
}

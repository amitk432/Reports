import React, { useState } from "react";
import { summaryUrl, fmtDate } from "../lib.js";
import Viewer from "./Viewer.jsx";
import Icon from "./Icon.jsx";
export default function Summaries({ summaries }) {
  const [viewing, setViewing] = useState(null);
  return (
    <section className="stack">
      <div className="cause-context">
        <Icon name="info" size={21} />
        <div>
          <b>Prepared from the records</b>
          <p>
            These documents are family summaries. Each document’s cautions are
            shown below; original hospital records are in All reports.
          </p>
        </div>
      </div>
      <div className="cards">
        {summaries.map((s) => (
          <article key={s.path} className="card summary-card">
            <span className="report-type-icon">
              <Icon name="file" size={24} />
            </span>
            <div className="summary-meta">
              <span className="pill neutral">
                {s.path.split(".").pop().toUpperCase()}
              </span>
              <small>{fmtDate(s.date)}</small>
            </div>
            <h3>{s.title}</h3>
            <p className="muted">{s.description}</p>
            {s.caution && <p className="note small">{s.caution}</p>}
            <div className="actions">
              {!s.path.endsWith(".xlsx") && (
                <button
                  className="btn ghost"
                  onClick={() =>
                    setViewing({
                      ...s,
                      summary: s.description,
                      isPrepared: true,
                      hospital: "Prepared family summary",
                      id: "Summary",
                    })
                  }
                >
                  View summary <Icon name="arrow" size={15} />
                </button>
              )}
              <a
                className="icon-button"
                href={summaryUrl(s.path)}
                download={s.path.split("/").pop()}
                aria-label={`Download ${s.title}`}
              >
                <Icon name="down" />
              </a>
            </div>
          </article>
        ))}
      </div>
      {viewing && (
        <Viewer
          list={[viewing]}
          i={0}
          setI={() => {}}
          close={() => setViewing(null)}
        />
      )}
    </section>
  );
}

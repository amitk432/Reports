import React from 'react';
import { fmtDate } from '../lib.js';

const Sources = ({ ids, openId }) =>
  ids?.length ? (
    <span className="sources">
      {ids.map((id, n) => (
        <button key={id} className="link" onClick={() => openId(id)} title="Open source report">
          {n === 0 ? 'source' : n + 1}
        </button>
      ))}
    </span>
  ) : null;

export default function Overview({ data, openId }) {
  const { patient, timeline, reports } = data;
  const perSource = Object.entries(
    reports.reduce((m, r) => ((m[r.hospital] = (m[r.hospital] || 0) + 1), m), {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stack">
      {patient.alerts?.length > 0 && (
        <section className="alerts" aria-label="Current alerts">
          {patient.alerts.map(a => (
            <article key={a.title} className={`alert ${a.level}`}>
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
              <Sources ids={a.sources} openId={openId} />
            </article>
          ))}
        </section>
      )}

      <div className="grid2">
        <section className="card">
          <h2>Diagnoses</h2>
          <ul className="plain">
            {patient.diagnoses.map(d => (
              <li key={d.text}>
                {d.text} <Sources ids={d.sources} openId={openId} />
              </li>
            ))}
          </ul>
          <h2>Identifiers</h2>
          <dl className="meta">
            {patient.identifiers.map(([k, v]) => (
              <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>
            ))}
          </dl>
        </section>

        <section className="card">
          <h2>Current medicines <span className="muted small">({patient.medications.asOf})</span></h2>
          <ul className="meds">
            {patient.medications.items.map(m => (
              <li key={m.name}><b>{m.name}</b> <span className="muted">{m.dose}</span></li>
            ))}
          </ul>
          <Sources ids={patient.medications.sources} openId={openId} />
        </section>
      </div>

      <section className="card">
        <h2>Timeline</h2>
        <ol className="timeline">
          {timeline.map(e => (
            <li key={e.date + e.title}>
              <time>{fmtDate(e.date)}</time>
              <div>
                <b>{e.title}</b>
                <p>{e.detail} <Sources ids={e.sources} openId={openId} /></p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Reports by source</h2>
        <ul className="bars">
          {perSource.map(([h, n]) => (
            <li key={h}>
              <a href="#index" onClick={() => sessionStorage.setItem('hospital', h)}>{h}</a>
              <span className="bar" style={{ '--w': (n / perSource[0][1]) * 100 + '%' }} />
              <span className="num">{n}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { fmtDate, trendKey, num, parseRange, normaliseValue } from '../lib.js';

// Build { testName: [{date, value, raw, flag, unit, range, report}] } from every report's findings.
function buildSeries(reports) {
  const series = {};
  for (const r of reports) {
    if (!r.date) continue;
    for (const f of r.findings || []) {
      if (/urine|24.?h/i.test(f.test + ' ' + r.title)) continue; // urine values aren't blood values
      // Handwritten summaries carry the sample date in the name: "Creatinine (30/09)".
      const d = f.test.match(/\((\d{1,2})\/(\d{1,2})\)\s*$/);
      const date = d ? `${r.date.slice(0, 4)}-${d[2].padStart(2, '0')}-${d[1].padStart(2, '0')}` : r.date;
      const key = trendKey(d ? f.test.slice(0, d.index) : f.test);
      const v = num(f.value);
      if (!key || v === null) continue;
      const value = normaliseValue(key, v, f.unit);
      const pts = (series[key] ||= []);
      // Same date + value = the same result seen on another report or photo.
      if (pts.some(p => p.date === date && p.value === value)) continue;
      pts.push({ date, value, raw: f.value, flag: f.flag, unit: f.unit, range: f.range, report: r });
    }
  }
  for (const k of Object.keys(series)) {
    series[k].sort((a, b) => a.date.localeCompare(b.date));
    if (series[k].length < 2) delete series[k];
  }
  return series;
}

function Chart({ points }) {
  const W = 720, H = 220, P = { l: 44, r: 16, t: 14, b: 28 };
  const range = points.map(p => parseRange(p.range)).find(Boolean);
  const vals = points.map(p => p.value).concat(range || []);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo || hi || 1) * 0.12;
  lo = Math.max(0, lo - pad); hi += pad;
  const t0 = +new Date(points[0].date), t1 = +new Date(points.at(-1).date) || t0 + 1;
  const x = d => P.l + ((+new Date(d) - t0) / (t1 - t0 || 1)) * (W - P.l - P.r);
  const y = v => H - P.b - ((v - lo) / (hi - lo)) * (H - P.t - P.b);
  const ticks = [lo, (lo + hi) / 2, hi];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Trend chart">
      {range && <rect x={P.l} width={W - P.l - P.r} y={y(range[1])} height={Math.max(0, y(range[0]) - y(range[1]))} className="band" />}
      {ticks.map(t => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={P.l - 6} y={y(t) + 4} textAnchor="end" className="axis">{+t.toFixed(t < 10 ? 1 : 0)}</text>
        </g>
      ))}
      <polyline points={points.map(p => `${x(p.date)},${y(p.value)}`).join(' ')} className="line" />
      {points.map((p, i) => (
        <circle key={i} cx={x(p.date)} cy={y(p.value)} r="4.5" className={'dot f-' + (p.flag || '')}>
          <title>{fmtDate(p.date)}: {p.raw} {p.unit}</title>
        </circle>
      ))}
      <text x={P.l} y={H - 8} className="axis">{fmtDate(points[0].date)}</text>
      <text x={W - P.r} y={H - 8} textAnchor="end" className="axis">{fmtDate(points.at(-1).date)}</text>
    </svg>
  );
}

export default function LabTrends({ reports, open }) {
  const series = useMemo(() => buildSeries(reports), [reports]);
  const names = Object.keys(series).sort((a, b) => series[b].length - series[a].length);
  const [test, setTest] = useState(names.includes('Creatinine') ? 'Creatinine' : names[0]);
  const pts = series[test] || [];

  if (!names.length) return <p className="muted">No numeric lab results to trend yet.</p>;

  return (
    <section className="grid-trends">
      <nav className="card testlist" aria-label="Tests">
        {names.map(n => (
          <button key={n} className={n === test ? 'on' : ''} onClick={() => setTest(n)}>
            {n} <span className="muted small">{series[n].length}</span>
          </button>
        ))}
      </nav>
      <div className="card">
        <h2>{test} <span className="muted small">{pts[0]?.unit} · reference {pts.find(p => p.range)?.range || '—'}</span></h2>
        <Chart points={pts} />
        <p className="muted small">Shaded band = laboratory reference range. Dialysis timing affects kidney values; compare like with like.</p>
        <div className="scroll-x">
          <table className="findings">
            <thead><tr><th>Date</th><th>Result</th><th>Unit</th><th>Reference</th><th>Source</th></tr></thead>
            <tbody>
              {pts.slice().reverse().map((p, i) => (
                <tr key={i} className={'f-' + (p.flag || '')}>
                  <td>{fmtDate(p.date)}</td><td className="num">{p.raw}</td><td>{p.unit}</td><td>{p.range}</td>
                  <td><button className="link" onClick={() => open(p.report)}>{p.report.hospital} · {p.report.id}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

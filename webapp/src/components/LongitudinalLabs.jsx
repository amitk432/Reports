import React, { useState } from 'react';

export default function LongitudinalLabs({ labs }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = labs.map(c => c.category);
  const dates = [
    '2026-04-15', '2026-04-19', '2026-04-20', '2026-04-23', '2026-04-25',
    '2026-05-02', '2026-05-14', '2026-05-23', '2026-05-28', '2026-06-03', '2026-06-05'
  ];

  const filteredCategories = labs.map(cat => {
    if (selectedCategory !== 'all' && cat.category !== selectedCategory) return null;
    const tests = cat.tests.filter(t => 
      !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.trend.toLowerCase().includes(search.toLowerCase())
    );
    if (tests.length === 0) return null;
    return { ...cat, tests };
  }).filter(Boolean);

  return (
    <div style={{ marginTop: '24px' }}>
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#f8fafc' }}>
              📊 Serial Laboratory & Diagnostic Biomarkers
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Longitudinal tracking across 13 clinical milestones from Janakpuri Super Speciality to SilverStreak & Sir Ganga Ram
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="/Lab_Values_Progress_Report.pdf" download className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              📕 Export PDF
            </a>
            <a href="/Lab_Values_Progress_Report.xlsx" download className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              📗 Export Excel
            </a>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Filter lab parameter (e.g. Creatinine, Procalcitonin, Hemoglobin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '240px',
              padding: '10px 14px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`btn ${selectedCategory === c ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                {c.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Groups */}
      {filteredCategories.map((group) => (
        <div key={group.category} className="glass-panel" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>
              {group.category}
            </h3>
            <span className="glass-pill" style={{ fontSize: '0.75rem' }}>
              {group.tests.length} Biomarkers Tracked
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '180px', color: '#94a3b8' }}>Parameter</th>
                  <th style={{ padding: '12px 10px', minWidth: '100px', color: '#64748b' }}>Normal Range</th>
                  {dates.map(d => (
                    <th key={d} style={{ padding: '12px 10px', minWidth: '85px', color: '#cbd5e1', fontSize: '0.75rem' }}>
                      {d.slice(5)}
                    </th>
                  ))}
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '220px', color: '#94a3b8' }}>Clinical Course & Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {group.tests.map((test, idx) => (
                  <tr
                    key={test.name}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                    }}
                  >
                    <td style={{ padding: '12px 14px', textAlign: 'left' }}>
                      <div style={{ fontWeight: '700', color: '#f8fafc' }}>{test.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unit: {test.unit}</div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {test.normal}
                    </td>
                    {dates.map(d => {
                      const val = test.history[d];
                      return (
                        <td key={d} style={{ padding: '12px 8px', textAlign: 'center' }}>
                          {val ? (
                            <span style={{
                              fontWeight: '700',
                              fontFamily: 'var(--font-mono)',
                              color: test.status === 'Critical' ? '#f87171' : test.status === 'Alert' ? '#fbbf24' : '#34d399',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              background: test.status === 'Critical' ? 'rgba(239, 68, 68, 0.12)' : 'transparent'
                            }}>
                              {val}
                            </span>
                          ) : (
                            <span style={{ color: '#475569' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ padding: '12px 14px', textAlign: 'left', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4' }}>
                      {test.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

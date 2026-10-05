import React from 'react';

export default function PatientHeader({ patient, activeTab, onTabChange, documentCount }) {
  if (!patient) return null;

  return (
    <header style={{ marginBottom: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', borderTop: '3px solid #0284c7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.8rem' }}>🩺</span>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  {patient.name}
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {patient.age} Yrs • {patient.gender} • Blood Group: <span style={{ color: '#ef4444', fontWeight: '700' }}>{patient.bloodGroup}</span> • UHID/IPD Multi-Hospital Record
                </p>
              </div>
            </div>
          </div>

          {/* Quick Critical Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="glass-pill" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <span style={{ color: '#f87171', fontWeight: '700' }}>🫀 Mitral Veg:</span> 1.9 cm
            </div>
            <div className="glass-pill" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <span style={{ color: '#f87171', fontWeight: '700' }}>⚡ Peak PCT:</span> 11.16 ng/mL
            </div>
            <div className="glass-pill" style={{ border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}>
              <span style={{ color: '#fbbf24', fontWeight: '700' }}>🫘 CKD G5:</span> Creatinine 6.2
            </div>
            <div className="glass-pill" style={{ border: '1px solid rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.1)' }}>
              <span style={{ color: '#c084fc', fontWeight: '700' }}>🦴 Infection:</span> Klebsiella PJI
            </div>
          </div>
        </div>

        {/* Diagnosis Bar */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <b style={{ color: '#38bdf8' }}>Primary Clinical Spectrum:</b> {patient.primaryDiagnosis}
          </p>
        </div>

        {/* Comorbidity Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
          {patient.comorbidities.map((item, idx) => (
            <span key={idx} className="glass-pill" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              • {item}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        gap: '10px',
        marginTop: '16px',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        {[
          { id: '3d', label: '🧍 3D Realistic Patient & Infection Map' },
          { id: 'documents', label: `📁 Document Archive (${documentCount || 121} Files)` },
          { id: 'labs', label: '📊 Longitudinal Lab Progress' },
          { id: 'summary', label: '📖 Comprehensive Clinical Summary' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem', padding: '10px 18px', borderRadius: '10px' }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

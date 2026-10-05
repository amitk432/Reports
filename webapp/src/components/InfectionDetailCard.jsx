import React from 'react';

export default function InfectionDetailCard({ infection, onViewDocument, onClose }) {
  if (!infection) return null;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      borderLeft: '4px solid #ef4444',
      boxShadow: '0 12px 36px rgba(239, 68, 68, 0.15)'
    }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.4rem' }}>
          {infection.key === 'hip' ? '🦴' : infection.key === 'heart' ? '🫀' : infection.key === 'brain' ? '🧠' : infection.key === 'kidney' ? '🫘' : '🩸'}
        </span>
        <div>
          <span className="badge-critical">{infection.severity}</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>
            {infection.title}
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '16px 0', background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: '10px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Anatomical Site</span>
          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '500' }}>{infection.anatomicalSite}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Confirmed Pathogen</span>
          <p style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: '600' }}>🦠 {infection.pathogen}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Detection Date</span>
          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '500' }}>📅 {infection.cultureDate}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Exact 3D Coordinates</span>
          <p style={{ fontSize: '0.85rem', color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
            X: {infection.coordinates.x}, Y: {infection.coordinates.y}, Z: {infection.coordinates.z}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>
          Pathology & Clinical Manifestation
        </h4>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          {infection.description}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>
          Systemic Cascade Impact
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#fca5a5', lineHeight: '1.5' }}>
          ⚠️ {infection.clinicalImpact}
        </p>
      </div>

      {infection.antibiogram && (
        <div style={{ marginBottom: '20px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '12px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>Antibiogram / Sensitivity Profile</span>
          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '4px' }}>{infection.antibiogram}</p>
        </div>
      )}

      {infection.documentLink && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>📄</span>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confirming Document:</span>
              <p style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: '600' }}>{infection.documentTitle}</p>
            </div>
          </div>
          <button
            onClick={() => onViewDocument(infection.documentLink, infection.documentTitle)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            🔍 View Medical Document →
          </button>
        </div>
      )}
    </div>
  );
}

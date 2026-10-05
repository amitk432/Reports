import React from 'react';

export default function ClinicalSummaryTab({ onViewDocument }) {
  const hospitalSummaries = [
    { name: 'Janakpuri Super Speciality Hospital', period: 'April 15 – May 14, 2026', desc: 'Identified 1.9 cm mitral vegetation on 2D Echo, severe CKD Stage 5 evaluation, viral serologies negative, initial hemodialysis initiation.', doc: '📄 Documents/Janakpuri Super Speciality Hospital/SUMMARY.md' },
    { name: 'GB Pant Hospital (GIPMER)', period: 'April 29, 2026', desc: 'Renal biopsy confirmed advanced nodular diabetic glomerulosclerosis with 80% IFTA (irreversible end-stage renal disease).', doc: '📄 Documents/GB Pant Hospital/SUMMARY.md' },
    { name: 'SilverStreak Hospital', period: 'May 23 – June 27, 2026', desc: 'Severe sepsis peak (PCT 11.16 ng/mL), purulent left hip sinus tract drained; pus culture confirmed MDR Klebsiella pneumoniae sensitive only to Colistin & Tigecycline.', doc: '📄 Documents/SilverStreak Hospital/SUMMARY.md' },
    { name: 'Sir Ganga Ram Hospital', period: 'June 03 – June 05, 2026', desc: 'Nephrology OPD consultations, electrolyte stabilization, anemia management, maintenance dialysis planning.', doc: '📄 Documents/Sir Ganga Ram Hospital/SUMMARY.md' },
    { name: 'Chandra Laxmi Hospital (CLH)', period: 'October 2026', desc: 'ICU critical care, ventilation, multi-organ stabilization, fluid overload management.', doc: '📄 Documents/Chandra Laxmi Hospital/SUMMARY.md' },
    { name: 'Diagnostic Labs (Dr Lal, Thyrovision, Prognosis)', period: 'Serial Follow-ups', desc: 'Longitudinal monitoring of serum creatinine, blood urea, electrolytes, viral markers, and hemograms.', doc: '📄 Documents/Dr Lal PathLabs/SUMMARY.md' }
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Narrative Section */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>
          🩺 Complete Pathophysiological Chain of Disease Progression
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
          Papa’s critical medical condition represents a multi-organ cascade triggered by chronic underlying metabolic disease and accelerated by a deep-seated prosthetic hardware infection:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700' }}>STAGE 1</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>Diabetic CKD G5 & Uremia</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Longstanding diabetes mellitus damaged renal glomeruli, resulting in Kimmelstiel-Wilson lesions (GB Pant Biopsy). Creatinine baseline ~4.8 mg/dL with severe uremic retention, chronic anemia, and immune compromise.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>STAGE 2</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>Left Hip Prosthetic Infection</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Bacteria (<i>Klebsiella pneumoniae</i>) colonized the left hip prosthetic joint hardware, creating an antibiotic-shielded biofilm and an active discharging sinus tract, seeding continuous bacterial showers into the bloodstream.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700' }}>STAGE 3</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>Systemic Sepsis Explosion</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Translocated bacteria caused severe septicemia. Procalcitonin skyrocketed to <b>11.16 ng/mL</b> at SilverStreak Hospital, accompanied by TLC 18,200/µL, CRP 88 mg/L, and severe vascular leakage (albumin dropped to 1.7 g/dL).
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>STAGE 4</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>1.9cm Mitral Valve Vegetation</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Circulating bacteria colonized the posterior mitral leaflet, forming a large mobile 1.9 cm x 0.8 cm vegetation with severe mitral regurgitation, documented on 2D Echo at Janakpuri Super Speciality Hospital.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #a855f7' }}>
            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '700' }}>STAGE 5</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>Cardioembolic Brain Strokes</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Fragments of the fragile mitral valve vegetation dislodged into carotid circulation, lodging into bilateral middle and posterior cerebral arteries, resulting in multifocal ischemic infarctions and neurological deficits.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>STAGE 6</span>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>Critical Multidisciplinary Care</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Intensive regimen combining targeted reserve antibiotics (Colistin, Meropenem), regular maintenance hemodialysis, inotropic support, blood transfusions (PRBC), and neuro-monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Clinical Summaries Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>
          🏥 Hospital-Wise Clinical Summaries & Key Findings
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {hospitalSummaries.map((h, i) => (
            <div key={i} className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#38bdf8', marginBottom: '6px', display: 'inline-block' }}>
                  {h.period}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', margin: '4px 0' }}>{h.name}</h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5', margin: '8px 0' }}>{h.desc}</p>
              </div>
              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => onViewDocument(h.doc, `${h.name} - Summary`)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  📖 View Complete Hospital Summary →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

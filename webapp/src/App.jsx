import React, { useState, useEffect } from 'react';
import PatientHeader from './components/PatientHeader.jsx';
import ThreePatientScene from './components/ThreePatientScene.jsx';
import InfectionDetailCard from './components/InfectionDetailCard.jsx';
import DocumentArchive from './components/DocumentArchive.jsx';
import LongitudinalLabs from './components/LongitudinalLabs.jsx';
import ClinicalSummaryTab from './components/ClinicalSummaryTab.jsx';
import DocumentViewerModal from './components/DocumentViewerModal.jsx';

// Fallback datasets for standalone / static deployment
import patientFallback from '../server/data/patient.json';
import infectionsFallback from '../server/data/infections.json';
import labsFallback from '../server/data/labs.json';
import documentsFallback from '../server/data/documents.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('3d');
  const [patient, setPatient] = useState(patientFallback);
  const [infections, setInfections] = useState(infectionsFallback);
  const [labs, setLabs] = useState(labsFallback);
  const [documents, setDocuments] = useState(documentsFallback);
  const [selectedInfection, setSelectedInfection] = useState(infectionsFallback[0]);
  const [modalDoc, setModalDoc] = useState(null); // { path, title }

  // Attempt to fetch fresh data from backend API
  useEffect(() => {
    fetch('/api/patient')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPatient(d); })
      .catch(() => {});

    fetch('/api/infections')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.length) { setInfections(d); setSelectedInfection(d[0]); } })
      .catch(() => {});

    fetch('/api/labs')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setLabs(d); })
      .catch(() => {});

    fetch('/api/documents')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.documents) setDocuments(d.documents); })
      .catch(() => {});
  }, []);

  const handleViewDocument = (path, title) => {
    setModalDoc({ path, title });
  };

  const handleCloseModal = () => {
    setModalDoc(null);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Patient Profile Header */}
      <PatientHeader
        patient={patient}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <main>
        {/* Tab 1: 3D Realistic Patient & Infection Mapping */}
        {activeTab === '3d' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px', alignItems: 'start' }}>
            {/* 3D Scene Viewport */}
            <div style={{ height: '700px', position: 'relative' }}>
              <ThreePatientScene
                infections={infections}
                selectedInfection={selectedInfection}
                onSelectInfection={setSelectedInfection}
              />
            </div>

            {/* Right Side: Infection Inspector & Progression Walkthrough */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Selected Infection Detail Card */}
              <InfectionDetailCard
                infection={selectedInfection}
                onViewDocument={handleViewDocument}
              />

              {/* Disease Progression Quick Selector */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
                  ⚡ Exact Pathological Loci (Plotted on Patient)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {infections.map((inf, idx) => (
                    <div
                      key={inf.id}
                      onClick={() => setSelectedInfection(inf)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: selectedInfection?.id === inf.id ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: selectedInfection?.id === inf.id ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: selectedInfection?.id === inf.id ? '#0284c7' : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {idx + 1}
                        </span>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>{inf.title}</p>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inf.anatomicalSite}</p>
                        </div>
                      </div>
                      <span className="badge-critical" style={{ fontSize: '0.65rem' }}>
                        {inf.key.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Master Document Archive */}
        {activeTab === 'documents' && (
          <DocumentArchive
            documents={documents}
            onViewDocument={handleViewDocument}
          />
        )}

        {/* Tab 3: Longitudinal Lab Values */}
        {activeTab === 'labs' && (
          <LongitudinalLabs
            labs={labs}
          />
        )}

        {/* Tab 4: Comprehensive Clinical Summary */}
        {activeTab === 'summary' && (
          <ClinicalSummaryTab
            onViewDocument={handleViewDocument}
          />
        )}
      </main>

      {/* Document Viewer Modal */}
      {modalDoc && (
        <DocumentViewerModal
          docPath={modalDoc.path}
          docTitle={modalDoc.title}
          onClose={handleCloseModal}
        />
      )}

      {/* Footer */}
      <footer style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
        <p>Papa's Clinical Dossier & 3D Interactive Web Application • Full-Stack Edition</p>
        <p>Repository: <a href="https://github.com/amitk432/Reports" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>github.com/amitk432/Reports</a></p>
      </footer>
    </div>
  );
}

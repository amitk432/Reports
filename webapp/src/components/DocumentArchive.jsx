import React, { useState, useMemo } from 'react';

export default function DocumentArchive({ documents, onViewDocument }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Extract unique hospitals and categories
  const hospitals = useMemo(() => {
    const set = new Set(documents.map(d => d.hospital));
    return Array.from(set).sort();
  }, [documents]);

  const categories = useMemo(() => {
    const set = new Set(documents.map(d => d.category));
    return Array.from(set).sort();
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchHospital = selectedHospital === 'all' || doc.hospital === selectedHospital;
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchType = selectedType === 'all' || doc.fileType === selectedType;
      const matchSearch = !searchTerm || 
        doc.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.date && doc.date.includes(searchTerm));
      return matchHospital && matchCategory && matchType && matchSearch;
    });
  }, [documents, selectedHospital, selectedCategory, selectedType, searchTerm]);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#f8fafc' }}>
              📁 Master Medical Document Archive
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Indexed archive of all clinical reports, imaging scans, discharge summaries, and culture antibiograms with direct document links
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="glass-pill" style={{ color: '#38bdf8', fontWeight: '700' }}>
              {filteredDocs.length} of {documents.length} Files
            </span>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="btn"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  background: viewMode === 'grid' ? '#0284c7' : 'transparent',
                  color: '#fff'
                }}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="btn"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  background: viewMode === 'table' ? '#0284c7' : 'transparent',
                  color: '#fff'
                }}
              >
                ≡ Table
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search by test name, pathogen, hospital, or date (e.g. Creatinine, Klebsiella, 2026-04-18)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Hospital Select */}
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.85rem'
            }}
          >
            <option value="all">🏥 All Hospitals ({documents.length})</option>
            {hospitals.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.85rem'
            }}
          >
            <option value="all">🏷️ All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Type Select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.85rem'
            }}
          >
            <option value="all">📄 All File Types</option>
            <option value="image">🖼️ Images (JPG/PNG)</option>
            <option value="pdf">📕 PDF Reports</option>
            <option value="markdown">📝 Markdown Summaries</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {doc.id}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: doc.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : doc.fileType === 'markdown' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: doc.fileType === 'pdf' ? '#f87171' : doc.fileType === 'markdown' ? '#38bdf8' : '#34d399',
                    fontWeight: '700'
                  }}>
                    {doc.fileType.toUpperCase()}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px', lineHeight: '1.4' }}>
                  {doc.displayName}
                </h4>

                <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '4px', fontWeight: '500' }}>
                  🏥 {doc.hospital}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>🏷️ {doc.category}</span>
                  {doc.date && <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>📅 {doc.date}</span>}
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>💾 {formatFileSize(doc.sizeBytes)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => onViewDocument(doc.relativePath, doc.displayName)}
                  className="btn btn-primary"
                  style={{ flex: '1', fontSize: '0.8rem', padding: '6px 10px', justifyContent: 'center' }}
                >
                  🔍 View Document
                </button>
                <a
                  href={`/documents-file/${encodeURIComponent(doc.relativePath)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  title="Open Raw File in New Tab"
                >
                  ↗ Direct
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>ID</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Document Title</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Hospital</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Category</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Date</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Type</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8' }}>Size</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr
                  key={doc.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                  }}
                >
                  <td style={{ padding: '10px 16px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{doc.id}</td>
                  <td style={{ padding: '10px 16px', fontWeight: '600', color: '#f8fafc' }}>{doc.displayName}</td>
                  <td style={{ padding: '10px 16px', color: '#38bdf8' }}>{doc.hospital}</td>
                  <td style={{ padding: '10px 16px', color: '#94a3b8' }}>{doc.category}</td>
                  <td style={{ padding: '10px 16px', color: '#cbd5e1' }}>{doc.date || '—'}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: doc.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: doc.fileType === 'pdf' ? '#f87171' : '#38bdf8',
                      fontWeight: '700'
                    }}>
                      {doc.fileType.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#64748b' }}>{formatFileSize(doc.sizeBytes)}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onViewDocument(doc.relativePath, doc.displayName)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        View
                      </button>
                      <a
                        href={`/documents-file/${encodeURIComponent(doc.relativePath)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

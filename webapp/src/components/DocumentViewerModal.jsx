import React, { useState, useEffect } from 'react';

export default function DocumentViewerModal({ docPath, docTitle, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  if (!docPath) return null;

  const ext = docPath.split('.').pop().toLowerCase();
  const fileUrl = `/documents-file/${encodeURIComponent(docPath)}`;
  const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  const isPdf = ext === 'pdf';
  const isMarkdown = ext === 'md';

  useEffect(() => {
    if (isMarkdown) {
      setLoading(true);
      fetch(fileUrl)
        .then(res => res.text())
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          setContent('Failed to load markdown content.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [docPath]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1000px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              {docTitle || 'Medical Document Viewer'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              {docPath}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              ↗ Open in Tab
            </a>
            <a
              href={fileUrl}
              download
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              ⬇ Download
            </a>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '1rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16'
        }}>
          {loading ? (
            <p style={{ color: '#38bdf8' }}>Loading document...</p>
          ) : isImage ? (
            <img
              src={fileUrl}
              alt={docTitle}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              title={docTitle}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px'
              }}
            />
          ) : isMarkdown ? (
            <div style={{
              width: '100%',
              height: '100%',
              padding: '20px',
              color: '#e2e8f0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              lineHeight: '1.6'
            }}>
              {content}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>This document type can be downloaded directly.</p>
              <a href={fileUrl} download className="btn btn-primary">Download File</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

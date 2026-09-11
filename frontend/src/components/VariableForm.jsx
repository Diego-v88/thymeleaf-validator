import React from 'react';
import { translations } from '../utils/translations';

export default function VariableForm({ variables, data, setData, lang = 'es' }) {
  const t = translations[lang] || translations.es;

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearAll = () => {
    const cleared = {};
    variables.forEach(v => { cleared[v.name] = ''; });
    setData(cleared);
  };

  return (
    <div className="panel variables-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="panel-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{t.extractedVariables}</span>
          <span className="badge badge-count">{variables.length}</span>
        </div>
        {variables.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleClearAll} title={t.clearValues}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>{t.clearValues}</span>
          </button>
        )}
      </div>

      <div className="variables-list" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {variables.length === 0 ? (
          <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.5rem', opacity: 0.6 }}>
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{t.noVariablesDetected}</p>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>{t.clickAnalyzeNotice}</span>
          </div>
        ) : (
          variables.map((v) => (
            <div className="variable-item" key={v.name}>
              <div className="variable-header">
                <label className="variable-label">{v.name}</label>
                {v.expressionType && (
                  <span className="variable-type-badge">{v.expressionType}</span>
                )}
              </div>
              <input
                type="text"
                value={data[v.name] || ''}
                onChange={(e) => handleChange(v.name, e.target.value)}
                placeholder={`Value for ${v.name}`}
                className="variable-input"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { translations } from '../utils/translations';

export default function RenderViewer({ 
  htmlContent, 
  onRender, 
  isRendering, 
  lang = 'es',
  isMaximized = false,
  onToggleMaximize
}) {
  const t = translations[lang] || translations.es;
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'source'
  const [deviceMode, setDeviceMode] = useState('full'); // 'full' | 'desktop' | 'tablet' | 'mobile'

  const handleDownload = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rendered_template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'desktop': return '1280px';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  return (
    <div className="panel render-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="panel-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{t.renderOutput}</span>
          
          {htmlContent && (
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setViewMode('preview')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {t.visual}
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'source' ? 'active' : ''}`}
                onClick={() => setViewMode('source')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                {t.source}
              </button>
            </div>
          )}
        </div>

        <div className="button-toolbar">
          {/* Device Switcher */}
          {htmlContent && viewMode === 'preview' && (
            <div className="device-toolbar">
              <button 
                className={`device-btn ${deviceMode === 'full' ? 'active' : ''}`} 
                onClick={() => setDeviceMode('full')}
                title={t.deviceFull}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </button>
              <button 
                className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`} 
                onClick={() => setDeviceMode('desktop')}
                title={t.deviceDesktop}
              >
                💻 1280px
              </button>
              <button 
                className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`} 
                onClick={() => setDeviceMode('tablet')}
                title={t.deviceTablet}
              >
                📱 768px
              </button>
              <button 
                className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`} 
                onClick={() => setDeviceMode('mobile')}
                title={t.deviceMobile}
              >
                📲 375px
              </button>
            </div>
          )}

          {onToggleMaximize && (
            <button 
              className={`btn btn-secondary btn-sm ${isMaximized ? 'active' : ''}`}
              onClick={onToggleMaximize}
              title={t.expandPreview}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMaximized ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                )}
              </svg>
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={handleDownload} disabled={!htmlContent} title={t.downloadHtml}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{t.downloadHtml}</span>
          </button>

          <button className="btn btn-primary" onClick={onRender} disabled={isRendering}>
            {isRendering ? (
              <>
                <span className="spinner"></span>
                <span>{t.rendering}</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>{t.renderNow}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="render-container" style={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: '0.5rem', background: '#0b0f19', display: 'flex', justifyContent: 'center' }}>
        {htmlContent ? (
          viewMode === 'preview' ? (
            <div 
              className={`device-frame-wrapper ${deviceMode !== 'full' ? 'device-framed' : ''}`} 
              style={{ width: getDeviceWidth(), height: '100%', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}
            >
              {deviceMode !== 'full' && (
                <div className="device-frame-header">
                  <span className="device-frame-title">{deviceMode.toUpperCase()} ({getDeviceWidth()})</span>
                </div>
              )}
              <iframe
                title="Render Preview"
                srcDoc={htmlContent}
                style={{ width: '100%', flex: 1, border: 'none', background: 'white' }}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          ) : (
            <pre style={{ width: '100%', height: '100%', margin: 0, padding: '1rem', fontFamily: '"Fira Code", monospace', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#f8fafc', background: '#1e293b' }}>
              {htmlContent}
            </pre>
          )
        ) : (
          <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '0.75rem', opacity: 0.6 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{t.noOutputYet}</p>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>{t.clickRenderNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
}

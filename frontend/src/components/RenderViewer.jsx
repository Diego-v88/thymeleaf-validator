import React from 'react';

export default function RenderViewer({ htmlContent, onRender, isRendering }) {
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

  return (
    <div className="panel" style={{ flex: 2 }}>
      <div className="panel-title">
        <span>Preview</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleDownload} disabled={!htmlContent} title="Download HTML">
            Download
          </button>
          <button className="btn btn-secondary" onClick={onRender} disabled={isRendering}>
            {isRendering ? 'Rendering...' : 'Render Now'}
          </button>
        </div>
      </div>
      <div className="render-wrapper">
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div className="empty-state" style={{color: '#9ca3af', marginTop: '2rem'}}>
            Click render to see the output
          </div>
        )}
      </div>
    </div>
  );
}

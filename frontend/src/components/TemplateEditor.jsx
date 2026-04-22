import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/themes/prism-tomorrow.css';

export default function TemplateEditor({ 
  template, 
  setTemplate, 
  onAnalyze, 
  isAnalyzing,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) {
  const lineCount = template.split(/\r\n|\r|\n/).length;
  const linesArr = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  const ActualEditor = Editor.default || Editor;

  const editorStyles = {
    fontFamily: '"Fira Code", monospace',
    fontSize: 14,
    lineHeight: '1.5',
    minHeight: '100%',
    outline: 'none',
    whiteSpace: 'pre'
  };

  return (
    <div className="panel" style={{ flex: 2 }}>
      <div className="panel-title">
        <span>Template Source (Thymeleaf)</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onUndo} disabled={!canUndo} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
            Undo
          </button>
          <button className="btn btn-secondary" onClick={onRedo} disabled={!canRedo} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
            Redo
          </button>
          <button className="btn" onClick={onAnalyze} disabled={isAnalyzing || !template.trim()}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Template'}
          </button>
        </div>
      </div>
      <div className="editor-container" style={{ display: 'flex', flex: 1, overflow: 'auto', border: '1px solid var(--border)', borderRadius: '0.5rem', backgroundColor: '#2d2d2d' }}>
        <div style={{ 
          padding: '15px 10px', 
          textAlign: 'right', 
          color: '#858585', 
          borderRight: '1px solid #444', 
          backgroundColor: '#1e1e1e', 
          userSelect: 'none', 
          fontFamily: '"Fira Code", monospace', 
          fontSize: 14, 
          lineHeight: '1.5',
          minWidth: '40px' 
        }}>
          {linesArr.map(n => <div key={n} style={{ height: '21px' }}>{n}</div>)}
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {ActualEditor && (typeof ActualEditor === 'function' || (typeof ActualEditor === 'object' && ActualEditor.$$typeof)) ? (
            <ActualEditor
              value={template}
              onValueChange={code => setTemplate(code)}
              highlight={code => Prism.highlight(code, Prism.languages.markup || {}, 'markup')}
              padding={15}
              style={editorStyles}
              className="code-editor"
            />
          ) : (
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              style={{ ...editorStyles, width: '100%', height: '100%', background: 'transparent', color: 'white', border: 'none', padding: '15px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

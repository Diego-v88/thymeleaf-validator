import React, { useState, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { translations } from '../utils/translations';

export default function TemplateEditor({ 
  template, 
  setTemplate, 
  onAnalyze, 
  isAnalyzing,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  lang = 'es'
}) {
  const t = translations[lang] || translations.es;
  const [lineWrapping, setLineWrapping] = useState(true);

  const extensions = useMemo(() => {
    const ext = [html()];
    if (lineWrapping) {
      ext.push(EditorView.lineWrapping);
    }
    return ext;
  }, [lineWrapping]);

  const lineCount = template.split(/\r\n|\r|\n/).length;
  const charCount = template.length;

  return (
    <div className="panel editor-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="panel-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{t.editorTitle}</span>
          <span className="badge badge-tech">Thymeleaf</span>
        </div>
        <div className="button-toolbar">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onUndo} 
            disabled={!canUndo} 
            title={t.undo}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14L4 9l5-5"/>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
            <span>{t.undo}</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onRedo} 
            disabled={!canRedo} 
            title={t.redo}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14l5-5-5-5"/>
              <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/>
            </svg>
            <span>{t.redo}</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm btn-danger-hover" 
            onClick={() => setTemplate('')} 
            disabled={!template} 
            title={t.clear}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>{t.clear}</span>
          </button>

          <button className="btn btn-primary" onClick={onAnalyze} disabled={isAnalyzing || !template.trim()}>
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/>
                  <path d="m14 7 3 3"/>
                  <path d="M5 6v4"/>
                  <path d="M19 14v4"/>
                  <path d="M10 2v2"/>
                  <path d="M7 8H3"/>
                </svg>
                <span>{t.analyze}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="codemirror-wrapper" style={{ flex: 1, minHeight: 0, overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '0.5rem 0.5rem 0 0' }}>
        <CodeMirror
          value={template}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={(val) => setTemplate(val)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: false,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightActiveLine: true,
          }}
          style={{ height: '100%', fontSize: '14px' }}
        />
      </div>

      <div className="editor-status-bar">
        <div className="status-left">
          <span>{lineCount} {t.lines}</span>
          <span className="dot-divider">•</span>
          <span>{charCount} {t.chars}</span>
        </div>
        <div className="status-right">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={lineWrapping} 
              onChange={(e) => setLineWrapping(e.target.checked)} 
            />
            <span>{t.wordWrap}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

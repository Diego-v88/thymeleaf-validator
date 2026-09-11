import React, { useState } from 'react';
import TemplateEditor from './components/TemplateEditor';
import VariableForm from './components/VariableForm';
import RenderViewer from './components/RenderViewer';
import CodeAnalysisView from './components/CodeAnalysisView';
import { analyzeTemplate, renderTemplate } from './services/apiClient';
import { translations } from './utils/translations';

function App() {
  const [lang, setLang] = useState('es');
  const t = translations[lang] || translations.es;

  const [template, setTemplate] = useState('<div th:text="${greeting}">Hola Mundo</div>\n<p th:if="${showUser}">Bienvenido, <span th:text="${username}">Usuario</span>!</p>\n<a href="https://example.com" th:href="@{/home}">Ir a Inicio</a>');
  const [variables, setVariables] = useState([]);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);
  const [htmlOutput, setHtmlOutput] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const [templateHistory, setTemplateHistory] = useState([
    '<div th:text="${greeting}">Hola Mundo</div>\n<p th:if="${showUser}">Bienvenido, <span th:text="${username}">Usuario</span>!</p>\n<a href="https://example.com" th:href="@{/home}">Ir a Inicio</a>'
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [layoutMode, setLayoutMode] = useState('split'); // 'split' | 'editor-max' | 'preview-max'
  const [activeRightTab, setActiveRightTab] = useState('variables'); // 'variables' | 'preview' | 'analysis'
  const [isIssuesExpanded, setIsIssuesExpanded] = useState(true);

  const handleAnalyze = async (templateToAnalyze = template) => {
    setIsAnalyzing(true);
    setErrors([]);
    try {
      const result = await analyzeTemplate(templateToAnalyze);
      setVariables(result.variables || []);
      setErrors(result.errors || []);
      
      const newData = { ...data };
      (result.variables || []).forEach(v => {
        if (newData[v.name] === undefined) {
          newData[v.name] = '';
        }
      });
      setData(newData);

      if (result.variables && result.variables.length > 0 && activeRightTab !== 'analysis') {
        setActiveRightTab('variables');
      }
    } catch {
      setErrors([{ message: t.failedToConnect, errorType: 'Network Error' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateTemplate = (newTemplate) => {
    setTemplate(newTemplate);
    const newHistory = templateHistory.slice(0, historyIndex + 1);
    newHistory.push(newTemplate);
    if (newHistory.length > 100) newHistory.shift();
    setTemplateHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setTemplate(templateHistory[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < templateHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setTemplate(templateHistory[nextIndex]);
    }
  };

  const handleRender = async () => {
    setIsRendering(true);
    setErrors([]);
    try {
      const result = await renderTemplate(template, data);
      setHtmlOutput(result.htmlOutput);
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }
      setActiveRightTab('preview');
    } catch {
      setErrors([{ message: t.failedToRender, errorType: 'Network Error' }]);
    } finally {
      setIsRendering(false);
    }
  };

  const toggleLayoutMode = (targetMode) => {
    if (layoutMode === targetMode) {
      setLayoutMode('split');
    } else {
      setLayoutMode(targetMode);
    }
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="header">
        <div className="header-brand">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m10 13-2 2 2 2"/>
              <path d="m14 17 2-2-2-2"/>
            </svg>
          </div>
          <div>
            <h1 className="title">{t.appTitle}</h1>
            <span className="subtitle">{t.appSubtitle}</span>
          </div>
        </div>

        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
              onClick={() => setLang('es')}
            >
              ES
            </button>
            <button 
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>

          {/* Layout Mode Toggles */}
          <div className="button-toolbar">
            <button 
              className={`btn ${layoutMode === 'editor-max' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleLayoutMode('editor-max')}
              title={t.expandEditor}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              <span>{layoutMode === 'editor-max' ? t.splitWorkspace : t.expandEditor}</span>
            </button>

            <button 
              className={`btn ${layoutMode === 'preview-max' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleLayoutMode('preview-max')}
              title={t.expandPreview}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              <span>{layoutMode === 'preview-max' ? t.splitWorkspace : t.expandPreview}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className={`workspace-grid ${layoutMode !== 'split' ? `mode-${layoutMode}` : ''}`}>
        {/* Left Column: Full-Height Code Editor */}
        {layoutMode !== 'preview-max' && (
          <div className="workspace-pane pane-editor">
            <TemplateEditor 
              template={template} 
              setTemplate={updateTemplate} 
              onAnalyze={() => handleAnalyze(template)} 
              isAnalyzing={isAnalyzing}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < templateHistory.length - 1}
              lang={lang}
            />
          </div>
        )}

        {/* Right Column: Tabbed Preview, Variables & Analysis Pane */}
        {layoutMode !== 'editor-max' && (
          <div className="workspace-pane pane-tabbed">
            <div className="tab-bar">
              <button 
                className={`tab-item ${activeRightTab === 'variables' ? 'active' : ''}`}
                onClick={() => setActiveRightTab('variables')}
              >
                <span>{t.tabsVariables}</span>
                <span className="tab-badge">{variables.length}</span>
              </button>
              <button 
                className={`tab-item ${activeRightTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveRightTab('preview')}
              >
                <span>{t.tabsPreview}</span>
                {htmlOutput && <span className="tab-indicator-active"></span>}
              </button>
              <button 
                className={`tab-item ${activeRightTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveRightTab('analysis')}
              >
                <span>{t.tabsAnalysis}</span>
              </button>
            </div>

            <div className="tab-content">
              {activeRightTab === 'variables' && layoutMode !== 'preview-max' && (
                <VariableForm 
                  variables={variables} 
                  data={data} 
                  setData={setData}
                  lang={lang}
                />
              )}
              {activeRightTab === 'preview' && (
                <RenderViewer 
                  htmlContent={htmlOutput} 
                  onRender={handleRender}
                  isRendering={isRendering}
                  lang={lang}
                  isMaximized={layoutMode === 'preview-max'}
                  onToggleMaximize={() => toggleLayoutMode('preview-max')}
                />
              )}
              {activeRightTab === 'analysis' && layoutMode !== 'preview-max' && (
                <CodeAnalysisView 
                  template={template}
                  lang={lang}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Errors & Issues Drawer */}
      <div className={`issues-drawer ${isIssuesExpanded ? 'open' : 'collapsed'}`}>
        <div className="issues-header" onClick={() => setIsIssuesExpanded(!isIssuesExpanded)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`status-dot ${errors.length > 0 ? 'dot-error' : 'dot-success'}`}></span>
            <span className="issues-title">{t.issuesTitle}</span>
            <span className={`issues-badge ${errors.length > 0 ? 'badge-error' : 'badge-success'}`}>
              {errors.length > 0 ? `${errors.length} ${t.issuesCount}` : t.clean}
            </span>
          </div>
          <button className="drawer-toggle-btn" aria-label="Toggle drawer">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ transform: isIssuesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </button>
        </div>

        {isIssuesExpanded && (
          <div className="issues-body">
            {errors.length > 0 ? (
              <ul className="error-list">
                {errors.map((err, idx) => (
                  <li key={idx} className="error-item">
                    <span className="error-type-tag">{err.errorType || 'Syntax Error'}</span>
                    <span className="error-msg">{err.message}</span>
                    {err.line && (
                      <span className="error-location">
                        Línea {err.line}{err.col ? `, Col ${err.col}` : ''}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="issues-clean-state">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{t.noIssuesDetected}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

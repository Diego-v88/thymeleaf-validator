import React, { useState } from 'react';
import TemplateEditor from './components/TemplateEditor';
import VariableForm from './components/VariableForm';
import RenderViewer from './components/RenderViewer';
import { analyzeTemplate, renderTemplate } from './services/apiClient';

function App() {
  const [template, setTemplate] = useState('<div th:text="${greeting}">Hello</div>');
  const [variables, setVariables] = useState([]);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);
  const [htmlOutput, setHtmlOutput] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const [templateHistory, setTemplateHistory] = useState(['<div th:text="${greeting}">Hello</div>']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);

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
    } catch (err) {
      setErrors([{ message: 'Failed to connect to backend.', errorType: 'Network' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateTemplate = (newTemplate) => {
    setTemplate(newTemplate);
    const newHistory = templateHistory.slice(0, historyIndex + 1);
    newHistory.push(newTemplate);
    // Keep max 100 history items
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
    setHtmlOutput('');
    try {
      const result = await renderTemplate(template, data);
      setHtmlOutput(result.htmlOutput);
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }
    } catch (err) {
      setErrors([{ message: 'Failed to connect to backend rendering.', errorType: 'Network' }]);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Thymeleaf Validator</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn btn-secondary" onClick={() => setIsEditorCollapsed(!isEditorCollapsed)}>
             {isEditorCollapsed ? 'Expand Editor' : 'Collapse Editor'}
           </button>
        </div>
      </header>

      <div className={`main-grid ${isEditorCollapsed ? 'collapsed-editor' : ''}`}>
        <div className="column left-column" style={{ display: isEditorCollapsed ? 'none' : 'flex' }}>
          <TemplateEditor 
            template={template} 
            setTemplate={updateTemplate} 
            onAnalyze={() => handleAnalyze(template)} 
            isAnalyzing={isAnalyzing}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < templateHistory.length - 1}
          />
          <VariableForm 
            variables={variables} 
            data={data} 
            setData={setData} 
          />
          <div className="panel errors-panel">
            <div className="panel-title">Errors & Issues</div>
            {errors.length > 0 ? (
              <ul className="error-list">
                {errors.map((err, idx) => (
                  <li key={idx} className="error-item">
                    <strong>{err.errorType}:</strong> {err.message} 
                    {err.line && ` (Line: ${err.line}, Col: ${err.col})`}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No issues detected.</div>
            )}
          </div>
        </div>
        
        <div className="column right-column">
          <RenderViewer 
            htmlContent={htmlOutput} 
            onRender={handleRender}
            isRendering={isRendering}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

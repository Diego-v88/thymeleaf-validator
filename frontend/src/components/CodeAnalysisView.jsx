import React, { useMemo } from 'react';
import { analyzeTemplateCode } from '../utils/codeAnalyzer';
import { translations } from '../utils/translations';

export default function CodeAnalysisView({ template, lang = 'es' }) {
  const t = translations[lang] || translations.es;

  const analysis = useMemo(() => {
    return analyzeTemplateCode(template);
  }, [template]);

  const totalFindings = analysis.links.length + analysis.textIssues.length + analysis.accessibility.length;

  return (
    <div className="panel analysis-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%', overflowY: 'auto' }}>
      <div className="panel-title" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{t.analysisTitle}</span>
          <span className="badge badge-tech">{totalFindings} findings</span>
        </div>
      </div>

      <div className="analysis-cards-grid">
        {/* Text Metrics Bar */}
        <div className="analysis-card metrics-card">
          <div className="metrics-row">
            <div className="metric-item">
              <span className="metric-value">{analysis.textMetrics.words}</span>
              <span className="metric-label">{t.wordCount}</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">{analysis.textMetrics.sentences}</span>
              <span className="metric-label">{t.sentencesCount}</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">~{analysis.textMetrics.readingTimeSeconds}s</span>
              <span className="metric-label">{t.estReadingTime}</span>
            </div>
          </div>
        </div>

        {/* 1. Links & Assets Inspector */}
        <div className="analysis-card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>{t.linksSectionTitle} ({analysis.links.length})</span>
          </div>
          <div className="card-body">
            {analysis.links.length === 0 ? (
              <div className="analysis-empty-text">{t.noLinksFound}</div>
            ) : (
              <ul className="analysis-list">
                {analysis.links.map((link, idx) => (
                  <li key={idx} className="link-analysis-item">
                    <div className="link-item-header">
                      <span className="link-kind-badge">{link.kind}</span>
                      <span className="link-type-badge">{link.type}</span>
                    </div>
                    <div className="link-url" title={link.url}>{link.url}</div>
                    <div className="link-text-preview">{link.text}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 2. Spellcheck & Text Quality Inspector */}
        <div className="analysis-card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>{t.textAuditTitle} ({analysis.textIssues.length})</span>
          </div>
          <div className="card-body">
            {analysis.textIssues.length === 0 ? (
              <div className="analysis-empty-text text-success">✓ {t.noTextIssues}</div>
            ) : (
              <ul className="analysis-list">
                {analysis.textIssues.map((issue, idx) => (
                  <li key={idx} className="issue-item warning-border">
                    <div className="issue-header">
                      <span className="issue-type-badge">{issue.type}</span>
                      <span className="issue-suggestion">{t.suggestion}: {issue.suggestion}</span>
                    </div>
                    <div className="issue-msg">{issue.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 3. Accessibility & Best Practices Audit */}
        <div className="analysis-card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{t.accessibilityTitle} ({analysis.accessibility.length})</span>
          </div>
          <div className="card-body">
            {analysis.accessibility.length === 0 ? (
              <div className="analysis-empty-text text-success">✓ {t.noAccessibilityIssues}</div>
            ) : (
              <ul className="analysis-list">
                {analysis.accessibility.map((a11y, idx) => (
                  <li key={idx} className="issue-item a11y-border">
                    <div className="issue-header">
                      <span className={`severity-tag ${a11y.severity.toLowerCase()}`}>{a11y.severity}</span>
                    </div>
                    <div className="issue-msg">{a11y.message}</div>
                    {a11y.codeSnippet && (
                      <code className="code-snippet">{a11y.codeSnippet}</code>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 4. Thymeleaf Directives Metrics */}
        <div className="analysis-card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>{t.thymeleafMetricsTitle} ({analysis.thymeleafStats.length})</span>
          </div>
          <div className="card-body">
            {analysis.thymeleafStats.length === 0 ? (
              <div className="analysis-empty-text">{t.noThymeleafDirectives}</div>
            ) : (
              <div className="thymeleaf-stats-grid">
                {analysis.thymeleafStats.map((stat, idx) => (
                  <div key={idx} className="stat-pill">
                    <span className="stat-name">{stat.directive}</span>
                    <span className="stat-count">{stat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { render, screen } from '@testing-library/react';
import CodeAnalysisView from './CodeAnalysisView';
import { analyzeTemplateCode } from '../utils/codeAnalyzer';
import { describe, it, expect } from 'vitest';

describe('codeAnalyzer Utility', () => {
  it('extracts links and assets correctly', () => {
    const template = `
      <a href="https://google.com">Search</a>
      <a th:href="@{/dashboard}">Dashboard</a>
      <img src="logo.png" alt="Logo" />
    `;
    const result = analyzeTemplateCode(template);

    expect(result.links.length).toBe(3);
    expect(result.links[0].url).toBe('https://google.com');
    expect(result.links[0].type).toBe('External URL');
    expect(result.links[1].url).toBe('@{/dashboard}');
    expect(result.links[1].type).toBe('Thymeleaf Link');
  });

  it('detects accessibility issues like missing alt on img', () => {
    const template = `<img src="banner.jpg" />`;
    const result = analyzeTemplateCode(template);

    expect(result.accessibility.length).toBe(1);
    expect(result.accessibility[0].message).toContain('missing "alt" attribute');
  });

  it('detects repeated words in text inspector', () => {
    const template = `<p>Este es el el texto de prueba</p>`;
    const result = analyzeTemplateCode(template);

    expect(result.textIssues.length).toBeGreaterThan(0);
    expect(result.textIssues.some(i => i.message.includes('el el'))).toBe(true);
  });
});

describe('CodeAnalysisView Component', () => {
  it('renders analysis sections in Spanish when lang="es"', () => {
    const template = `<a href="https://example.com">Ejemplo</a>`;
    render(<CodeAnalysisView template={template} lang="es" />);

    expect(screen.getByText(/Informe de Análisis/i)).toBeInTheDocument();
    expect(screen.getByText(/Enlaces y Recursos Detectados/i)).toBeInTheDocument();
  });

  it('renders analysis sections in English when lang="en"', () => {
    const template = `<a href="https://example.com">Example</a>`;
    render(<CodeAnalysisView template={template} lang="en" />);

    expect(screen.getByText(/Code Structure & Audit Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Detected Links & Assets/i)).toBeInTheDocument();
  });
});

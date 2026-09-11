import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiClient from './services/apiClient';

vi.mock('./services/apiClient', () => ({
  analyzeTemplate: vi.fn(),
  renderTemplate: vi.fn()
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders main application header and title', () => {
    render(<App />);
    expect(screen.getByText('Thymeleaf Validator')).toBeInTheDocument();
    expect(screen.getByText('Validador de Plantillas e Inspector de Variables')).toBeInTheDocument();
  });

  it('switches language between ES and EN when language buttons are clicked', () => {
    render(<App />);
    const enBtn = screen.getByText('EN');
    fireEvent.click(enBtn);

    expect(screen.getByText('Template Engine & Variable Inspector')).toBeInTheDocument();
    expect(screen.getByText('Expand Editor')).toBeInTheDocument();

    const esBtn = screen.getByText('ES');
    fireEvent.click(esBtn);
    expect(screen.getByText('Validador de Plantillas e Inspector de Variables')).toBeInTheDocument();
  });

  it('toggles expand editor view state when button is clicked', () => {
    render(<App />);
    const expandBtn = screen.getByText('Expandir Editor');
    fireEvent.click(expandBtn);
    expect(screen.getAllByText('Vista Dividida').length).toBeGreaterThan(0);
  });

  it('toggles expand preview view state when button is clicked', () => {
    render(<App />);
    const expandPreviewBtn = screen.getByText('Expandir Previsualización');
    fireEvent.click(expandPreviewBtn);
    expect(screen.getAllByText('Vista Dividida').length).toBeGreaterThan(0);
  });

  it('calls analyzeTemplate when analyze button is clicked', async () => {
    apiClient.analyzeTemplate.mockResolvedValueOnce({
      variables: [{ name: 'user', expressionType: 'String' }],
      errors: []
    });

    render(<App />);
    const analyzeBtn = screen.getByText('Analizar Plantilla');
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(apiClient.analyzeTemplate).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error badge when backend analysis fails', async () => {
    apiClient.analyzeTemplate.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    const analyzeBtn = screen.getByText('Analizar Plantilla');
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText('Error al conectar con el servicio backend.')).toBeInTheDocument();
    });
  });
});

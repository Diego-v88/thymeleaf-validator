import { render, screen, waitFor } from '@testing-library/react';
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

  it('renders main application title', () => {
    render(<App />);
    expect(screen.getByText('Thymeleaf Validator')).toBeInTheDocument();
  });
});

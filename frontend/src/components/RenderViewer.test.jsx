import { render, screen, fireEvent } from '@testing-library/react';
import RenderViewer from './RenderViewer';
import { describe, it, expect, vi } from 'vitest';

describe('RenderViewer Component', () => {
  it('renders empty state when htmlContent is empty', () => {
    render(<RenderViewer htmlContent="" onRender={() => {}} isRendering={false} lang="en" />);
    expect(screen.getByText('No rendered output yet')).toBeInTheDocument();
    expect(screen.getByText('Render Now')).toBeInTheDocument();
  });

  it('renders iframe in visual viewMode when htmlContent is provided', () => {
    render(<RenderViewer htmlContent="<h1>Hello Test</h1>" onRender={() => {}} isRendering={false} lang="en" />);
    const iframe = screen.getByTitle('Render Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('srcDoc', '<h1>Hello Test</h1>');
  });

  it('allows toggling to source code view', () => {
    render(<RenderViewer htmlContent="<h1>Hello Test</h1>" onRender={() => {}} isRendering={false} lang="en" />);
    const sourceBtn = screen.getByText('Source Code');
    fireEvent.click(sourceBtn);

    expect(screen.getByText('<h1>Hello Test</h1>')).toBeInTheDocument();
  });

  it('shows device mode toolbar buttons when htmlContent is present', () => {
    render(<RenderViewer htmlContent="<h1>Hello Test</h1>" onRender={() => {}} isRendering={false} lang="en" />);
    expect(screen.getByTitle('Desktop (1280px)')).toBeInTheDocument();
    expect(screen.getByTitle('Tablet (768px)')).toBeInTheDocument();
    expect(screen.getByTitle('Mobile (375px)')).toBeInTheDocument();
  });

  it('shows loading state when isRendering is true', () => {
    render(<RenderViewer htmlContent="" onRender={() => {}} isRendering={true} lang="en" />);
    expect(screen.getByText('Rendering...')).toBeInTheDocument();
    expect(screen.getByText('Rendering...').closest('button')).toBeDisabled();
  });

  it('triggers onRender when Render Now is clicked', () => {
    const onRenderMock = vi.fn();
    render(<RenderViewer htmlContent="" onRender={onRenderMock} isRendering={false} lang="en" />);
    const renderBtn = screen.getByText('Render Now');
    fireEvent.click(renderBtn);
    expect(onRenderMock).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import TemplateEditor from './TemplateEditor';
import { describe, it, expect, vi } from 'vitest';

describe('TemplateEditor', () => {
  it('renders analyze button', () => {
    render(<TemplateEditor template="<p></p>" setTemplate={() => {}} onAnalyze={() => {}} isAnalyzing={false} onUndo={() => {}} onRedo={() => {}} canUndo={false} canRedo={false} />);
    expect(screen.getByText('Analyze Template')).toBeInTheDocument();
  });

  it('disables analyze button when analyzing is true', () => {
    render(<TemplateEditor template="<p></p>" setTemplate={() => {}} onAnalyze={() => {}} isAnalyzing={true} onUndo={() => {}} onRedo={() => {}} canUndo={false} canRedo={false} />);
    const analyzeBtn = screen.getByText('Analyzing...');
    expect(analyzeBtn).toBeDisabled();
  });

  it('triggers onUndo when undo is clicked', () => {
    const undoMock = vi.fn();
    render(<TemplateEditor template="<p></p>" setTemplate={() => {}} onAnalyze={() => {}} isAnalyzing={false} onUndo={undoMock} onRedo={() => {}} canUndo={true} canRedo={false} />);
    
    const undoBtn = screen.getByText('Undo');
    expect(undoBtn).not.toBeDisabled();
    fireEvent.click(undoBtn);
    expect(undoMock).toHaveBeenCalled();
  });
});

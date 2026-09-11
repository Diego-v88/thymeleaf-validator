import { render, screen, fireEvent } from '@testing-library/react';
import TemplateEditor from './TemplateEditor';
import { describe, it, expect, vi } from 'vitest';

describe('TemplateEditor Component', () => {
  it('renders analyze button and title in English when lang="en"', () => {
    render(
      <TemplateEditor 
        template="<p>Test</p>" 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={() => {}} 
        onRedo={() => {}} 
        canUndo={false} 
        canRedo={false} 
        lang="en"
      />
    );
    expect(screen.getByText('Template Editor')).toBeInTheDocument();
    expect(screen.getByText('Analyze Template')).toBeInTheDocument();
  });

  it('renders analyze button and title in Spanish when lang="es"', () => {
    render(
      <TemplateEditor 
        template="<p>Test</p>" 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={() => {}} 
        onRedo={() => {}} 
        canUndo={false} 
        canRedo={false} 
        lang="es"
      />
    );
    expect(screen.getByText('Editor de Plantilla')).toBeInTheDocument();
    expect(screen.getByText('Analizar Plantilla')).toBeInTheDocument();
  });

  it('disables analyze button when isAnalyzing is true', () => {
    render(
      <TemplateEditor 
        template="<p>Test</p>" 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={true} 
        onUndo={() => {}} 
        onRedo={() => {}} 
        canUndo={false} 
        canRedo={false} 
        lang="en"
      />
    );
    const analyzeBtn = screen.getByText('Analyzing...').closest('button');
    expect(analyzeBtn).toBeDisabled();
  });

  it('disables analyze button when template is whitespace', () => {
    render(
      <TemplateEditor 
        template="   " 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={() => {}} 
        onRedo={() => {}} 
        canUndo={false} 
        canRedo={false} 
        lang="en"
      />
    );
    const analyzeBtn = screen.getByText('Analyze Template').closest('button');
    expect(analyzeBtn).toBeDisabled();
  });

  it('triggers onUndo when Undo is clicked', () => {
    const undoMock = vi.fn();
    render(
      <TemplateEditor 
        template="<p>Test</p>" 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={undoMock} 
        onRedo={() => {}} 
        canUndo={true} 
        canRedo={false} 
        lang="en"
      />
    );
    
    const undoBtn = screen.getByText('Undo').closest('button');
    expect(undoBtn).not.toBeDisabled();
    fireEvent.click(undoBtn);
    expect(undoMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onRedo when Redo is clicked', () => {
    const redoMock = vi.fn();
    render(
      <TemplateEditor 
        template="<p>Test</p>" 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={() => {}} 
        onRedo={redoMock} 
        canUndo={false} 
        canRedo={true} 
        lang="en"
      />
    );
    
    const redoBtn = screen.getByText('Redo').closest('button');
    expect(redoBtn).not.toBeDisabled();
    fireEvent.click(redoBtn);
    expect(redoMock).toHaveBeenCalledTimes(1);
  });

  it('displays correct line and character count in status bar', () => {
    render(
      <TemplateEditor 
        template={"line1\nline2\nline3"} 
        setTemplate={() => {}} 
        onAnalyze={() => {}} 
        isAnalyzing={false} 
        onUndo={() => {}} 
        onRedo={() => {}} 
        canUndo={false} 
        canRedo={false} 
        lang="en"
      />
    );
    expect(screen.getByText('3 lines')).toBeInTheDocument();
    expect(screen.getByText('17 chars')).toBeInTheDocument();
  });
});

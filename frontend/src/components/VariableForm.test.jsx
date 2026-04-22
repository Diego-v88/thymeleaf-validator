import { render, screen, fireEvent } from '@testing-library/react';
import VariableForm from './VariableForm';
import { describe, it, expect, vi } from 'vitest';

describe('VariableForm', () => {
  it('renders an empty state when no variables are provided', () => {
    render(<VariableForm variables={[]} data={{}} setData={() => {}} />);
    expect(screen.getByText('No variables detected yet.')).toBeInTheDocument();
  });

  it('renders inputs for each provided variable', () => {
    const variables = [{ name: 'user' }, { name: 'estado' }];
    render(<VariableForm variables={variables} data={{}} setData={() => {}} />);
    
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('estado')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(2);
  });

  it('calls setData when user types into an input', () => {
    const variables = [{ name: 'greeting' }];
    const setDataMock = vi.fn();
    
    render(<VariableForm variables={variables} data={{ greeting: '' }} setData={setDataMock} />);
    
    const input = screen.getByPlaceholderText('Value for greeting');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(setDataMock).toHaveBeenCalled();
  });
});

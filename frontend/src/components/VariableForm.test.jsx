import { render, screen, fireEvent } from '@testing-library/react';
import VariableForm from './VariableForm';
import { describe, it, expect, vi } from 'vitest';

describe('VariableForm Component', () => {
  it('renders an empty state when no variables are provided', () => {
    render(<VariableForm variables={[]} data={{}} setData={() => {}} lang="en" />);
    expect(screen.getByText('No variables detected yet.')).toBeInTheDocument();
  });

  it('renders inputs for each provided variable', () => {
    const variables = [{ name: 'greeting' }, { name: 'user' }];
    render(<VariableForm variables={variables} data={{ greeting: 'Hello', user: 'Diego' }} setData={() => {}} lang="en" />);
    
    expect(screen.getByText('greeting')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('calls setData when user types into an input', () => {
    const setDataMock = vi.fn();
    const variables = [{ name: 'greeting' }];
    render(<VariableForm variables={variables} data={{ greeting: '' }} setData={setDataMock} lang="en" />);

    const input = screen.getByPlaceholderText('Value for greeting');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(setDataMock).toHaveBeenCalled();
  });

  it('clears all input values when Clear Values button is clicked', () => {
    const setDataMock = vi.fn();
    const variables = [{ name: 'greeting' }, { name: 'user' }];
    render(<VariableForm variables={variables} data={{ greeting: 'Hello', user: 'Diego' }} setData={setDataMock} lang="en" />);

    const clearBtn = screen.getByText('Clear Values');
    fireEvent.click(clearBtn);

    expect(setDataMock).toHaveBeenCalledWith({ greeting: '', user: '' });
  });
});

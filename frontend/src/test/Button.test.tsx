import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Watermelon UI Button Component', () => {
  it('renders button with label and responds to clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit Application</Button>);
    
    const btn = screen.getByText('Submit Application');
    expect(btn).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button when disabled prop is set', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Apply</Button>);
    
    const btn = screen.getByText('Apply');
    expect(btn).toBeDisabled();
    
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state when loading prop is true', () => {
    render(<Button loading>Processing</Button>);
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });
});

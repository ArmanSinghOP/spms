import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, EligibilityBadge, ApplicationStatusBadge } from '../components/ui/Badge';

describe('Watermelon UI Badge Components', () => {
  it('renders standard Badge with custom text', () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
  });

  it('renders EligibilityBadge as Eligible with green styling', () => {
    render(<EligibilityBadge eligible={true} />);
    const badge = screen.getByText('Eligible');
    expect(badge).toBeInTheDocument();
  });

  it('renders EligibilityBadge as Ineligible with red styling', () => {
    render(<EligibilityBadge eligible={false} />);
    const badge = screen.getByText('Ineligible');
    expect(badge).toBeInTheDocument();
  });

  it('renders ApplicationStatusBadge with appropriate status text', () => {
    render(<ApplicationStatusBadge status="Selected" />);
    expect(screen.getByText('Selected')).toBeInTheDocument();

    render(<ApplicationStatusBadge status="Under Review" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });
});

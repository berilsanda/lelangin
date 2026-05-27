import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { AuctionStatusBadge } from '../AuctionStatusBadge';

describe('AuctionStatusBadge', () => {
  it('renders "Active" label for active status', () => {
    render(<AuctionStatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders "Closed" label for closed status', () => {
    render(<AuctionStatusBadge status="closed" />);
    expect(screen.getByText('Closed')).toBeTruthy();
  });

  it('renders "Pending" label for pending status', () => {
    render(<AuctionStatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import type { Auction } from '@/types';

import { AuctionCard } from '../AuctionCard';

const mockAuction: Auction = {
  id: 'a1',
  title: 'Test Auction',
  currentBid: 100000,
  startingBid: 50000,
  status: 'active',
  images: [],
  sellerId: 'u1',
  createdAt: new Date(),
  endAt: new Date(Date.now() + 86400000),
  description: 'desc',
};

describe('AuctionCard', () => {
  it('renders auction title', () => {
    render(<AuctionCard auction={mockAuction} />);
    expect(screen.getByText('Test Auction')).toBeTruthy();
  });

  it('renders current bid formatted as IDR (contains Rp)', () => {
    render(<AuctionCard auction={mockAuction} />);
    const bidText = screen.getByText(/Rp/);
    expect(bidText).toBeTruthy();
  });

  it('renders status badge with label "Active" when status is active', () => {
    render(<AuctionCard auction={mockAuction} />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders status badge with label "Closed" when status is closed', () => {
    render(<AuctionCard auction={{ ...mockAuction, status: 'closed' }} />);
    expect(screen.getByText('Closed')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<AuctionCard auction={mockAuction} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

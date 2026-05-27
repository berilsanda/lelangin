import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';

import { BidTooLowError } from '@/types';
import { queryKeys } from '@/services/query-keys';

const mockPlaceBid = jest.fn<Promise<undefined>, [string, number, string]>();

jest.mock('@/services/firebase/bid-service', () => ({
  placeBid: (...args: [string, number, string]) => mockPlaceBid(...args),
}));

import { usePlaceBid } from '../use-place-bid';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return { wrapper, queryClient };
};

describe('usePlaceBid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invalidates auction detail query on successful bid', async () => {
    const auctionId = 'auction-123';
    mockPlaceBid.mockResolvedValueOnce(undefined);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => usePlaceBid(auctionId), { wrapper });

    await act(async () => {
      result.current.mutate({ amount: 500, userId: 'user-1' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.auctions.detail(auctionId),
      }),
    );
  });

  it('exposes a BidTooLowError instance when placeBid rejects with one', async () => {
    const auctionId = 'auction-456';
    const error = new BidTooLowError(300, 100);
    mockPlaceBid.mockRejectedValueOnce(error);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaceBid(auctionId), { wrapper });

    await act(async () => {
      result.current.mutate({ amount: 100, userId: 'user-2' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(BidTooLowError);
  });
});

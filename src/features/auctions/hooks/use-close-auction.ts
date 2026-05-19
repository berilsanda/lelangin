import { useMutation, useQueryClient } from '@tanstack/react-query';

import { closeAuction } from '@/services/firebase/auction-service';
import { queryKeys } from '@/services/query-keys';

/**
 * Close an auction by id.
 * On success, invalidates both the paginated list and the specific detail entry
 * so all consumers see the updated `status: 'closed'` immediately.
 */
export function useCloseAuction() {
  const queryClient = useQueryClient();

  return useMutation<undefined, Error, string>({
    mutationFn: (id) => closeAuction(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.detail(id) });
    },
  });
}

import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  bottomSheetOpen: boolean;
  selectedAuctionId: string | null;
}

interface UIActions {
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  selectAuction: (auctionId: string | null) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  isDarkMode: false,
  bottomSheetOpen: false,
  selectedAuctionId: null,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDarkMode) => set({ isDarkMode }),
  openBottomSheet: () => set({ bottomSheetOpen: true }),
  closeBottomSheet: () => set({ bottomSheetOpen: false }),
  selectAuction: (auctionId) => set({ selectedAuctionId: auctionId }),
}));

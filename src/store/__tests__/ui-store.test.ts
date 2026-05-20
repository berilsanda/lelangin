import { useUIStore } from '../ui-store';

const initialState = {
  isDarkMode: false,
  bottomSheetOpen: false,
  selectedAuctionId: null,
};

beforeEach(() => {
  useUIStore.setState(initialState);
});

describe('useUIStore', () => {
  it('has correct initial state', () => {
    const { isDarkMode, bottomSheetOpen, selectedAuctionId } = useUIStore.getState();
    expect(isDarkMode).toBe(false);
    expect(bottomSheetOpen).toBe(false);
    expect(selectedAuctionId).toBeNull();
  });

  it('toggleDarkMode flips isDarkMode from false to true', () => {
    useUIStore.getState().toggleDarkMode();
    expect(useUIStore.getState().isDarkMode).toBe(true);
  });

  it('setDarkMode(true) sets isDarkMode to true', () => {
    useUIStore.getState().setDarkMode(true);
    expect(useUIStore.getState().isDarkMode).toBe(true);
  });

  it('openBottomSheet sets bottomSheetOpen to true', () => {
    useUIStore.getState().openBottomSheet();
    expect(useUIStore.getState().bottomSheetOpen).toBe(true);
  });

  it('closeBottomSheet sets bottomSheetOpen to false', () => {
    useUIStore.getState().openBottomSheet();
    useUIStore.getState().closeBottomSheet();
    expect(useUIStore.getState().bottomSheetOpen).toBe(false);
  });

  it("selectAuction('auction-1') sets selectedAuctionId to 'auction-1'", () => {
    useUIStore.getState().selectAuction('auction-1');
    expect(useUIStore.getState().selectedAuctionId).toBe('auction-1');
  });

  it('selectAuction(null) sets selectedAuctionId to null', () => {
    useUIStore.getState().selectAuction('auction-1');
    useUIStore.getState().selectAuction(null);
    expect(useUIStore.getState().selectedAuctionId).toBeNull();
  });
});

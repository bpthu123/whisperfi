import { create } from 'zustand';

interface PrivacySettingsState {
  flashbotsEnabled: boolean;
  toggleFlashbots: () => void;
}

export const usePrivacySettings = create<PrivacySettingsState>((set) => ({
  flashbotsEnabled: false,
  toggleFlashbots: () => set((s) => ({ flashbotsEnabled: !s.flashbotsEnabled })),
}));

// Flashbots Protect RPC sends txs to a private mempool, preventing front-running
export const FLASHBOTS_RPC = 'https://rpc.flashbots.net';

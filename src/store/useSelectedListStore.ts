import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { UserProfileSummary } from '@/types';

interface SelectedListState {
  profiles: Record<string, UserProfileSummary>;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  toggleProfile: (profile: UserProfileSummary) => void;
  clearList: () => void;
}

export const useSelectedListStore = create<SelectedListState>()(
  persist(
    (set) => ({
      profiles: {},
      addProfile: (profile) =>
        set((state) => ({
          profiles: { ...state.profiles, [profile.user_id]: profile },
        })),
      removeProfile: (userId) =>
        set((state) => {
          const newProfiles = { ...state.profiles };
          delete newProfiles[userId];
          return { profiles: newProfiles };
        }),
      toggleProfile: (profile) =>
        set((state) => {
          const exists = !!state.profiles[profile.user_id];
          if (exists) {
            const newProfiles = { ...state.profiles };
            delete newProfiles[profile.user_id];
            return { profiles: newProfiles };
          }
          return {
            profiles: { ...state.profiles, [profile.user_id]: profile },
          };
        }),
      clearList: () => set({ profiles: {} }),
    }),
    {
      name: 'influencer-selected-list',
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          // Graceful fallback if localStorage is unavailable
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
    }
  )
);

// Selectors
export const useIsProfileSelected = (userId: string) =>
  useSelectedListStore((state) => !!state.profiles[userId]);

export const useSelectedCount = () =>
  useSelectedListStore((state) => Object.keys(state.profiles).length);

// useShallow prevents a new array reference on every render
export const useSelectedProfilesList = () =>
  useSelectedListStore(
    useShallow((state) => Object.values(state.profiles))
  );

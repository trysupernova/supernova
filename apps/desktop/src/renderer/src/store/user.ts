import { create } from 'zustand'
import { Models } from 'appwrite'

export type UserSession = Models.User<Models.Preferences> | null

interface State {
  user: UserSession
  updateUser: (update: Partial<Models.User<Models.Preferences>>) => void
  clearUser: () => void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  updateUser: (update) => set((prev) => ({ user: { ...prev.user, ...update } as UserSession })),
  clearUser: () => set({ user: null })
}))

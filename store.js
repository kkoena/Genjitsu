import { create } from 'zustand'
export const useStore = create((set) => ({
  booted: false, search: false, active: null, glitch: false, flame: false,
  setBooted: () => set({ booted: true }),
  setSearch: (search) => set({ search }),
  open: (id) => set({ active: id }),
  close: () => set({ active: null }),
  setFlame: (flame) => set({ flame }),
  triggerGlitch: () => { set({ glitch: true }); setTimeout(() => set({ glitch: false }), 1000) },
}))

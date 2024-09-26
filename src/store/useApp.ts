import { create } from "zustand"

interface AppState {
  time: any
  loading: boolean
  changeTime: (time: any) => void
  changeLoading: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  time: null,
  loading: false,
  changeTime: (time) => set({ time }),
  changeLoading: ( value ) => set( { loading: value })
}))

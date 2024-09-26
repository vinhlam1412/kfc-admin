import { create } from "zustand"

interface userState {
  visibleAddAccount: boolean
  visibleUpdateAccount: boolean
  dataDetailAccount: any
  changeVisibleAddAccount: (visibleAddAccount: boolean) => void
  changeVisibleUpdateAccount: (visible: boolean) => void
  setDataDetailAccount: (dataDetailAccount: any) => void,
}

export const useUserStore = create<userState>((set) => ({
  visibleAddAccount: false,
  visibleUpdateAccount: false,
  dataDetailAccount: {},
  changeVisibleAddAccount: (visibleAddAccount) => set({ visibleAddAccount }),
  changeVisibleUpdateAccount: (visibleUpdateAccount) => set({ visibleUpdateAccount }),
  setDataDetailAccount: (dataDetailAccount: any) => set({ dataDetailAccount }),
}))

import { create } from "zustand"

interface settingState {
  tabSetting: string
  changeTabSetting: (tab: string) => void
}

export const useSettingStore = create<settingState>((set) => ({
  tabSetting: "giftRegion",
  changeTabSetting: (tab) => {
    localStorage.setItem('defaultTabSetting', tab || '')
    set({ tabSetting: tab })
  },
}))

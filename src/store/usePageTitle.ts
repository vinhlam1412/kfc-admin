import { create } from "zustand"

interface PageTitleState {
  title: string
  changeTitle: (title: string) => void
}

export const usePageTitleStore = create<PageTitleState>((set) => ({
  title: "Dashboard",
  changeTitle: (title) => set({ title }),
}))

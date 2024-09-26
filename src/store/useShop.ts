import { IStores } from "@/domain/Store"
import { create } from "zustand"
interface storeState {
  visible: boolean
  visibleUpdate: boolean
  dataDetailStore: Partial<IStores>
  changeVisible: (visible: boolean) => void
  changeVisibleUpdate: (visible: boolean) => void
  setDataDetailStore: (dataDetailStore: any) => void,
}

export const useShopStore = create<storeState>((set) => ({
  visible: false,
  visibleUpdate: false,
  dataDetailStore: {},
  changeVisible: (visible) => set({ visible }),
  changeVisibleUpdate: (visibleUpdate) => set({ visibleUpdate }),
  setDataDetailStore: (dataDetailStore: any) => set({ dataDetailStore }),
}))

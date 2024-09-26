import { IGift, IRewardRespond } from "@/domain/Gift"
import { create } from "zustand"

interface giftState {
  tabGift: string
  visibleAddVoucher: boolean
  visibleImportVoucher: boolean
  visibleUpdateVoucher: boolean
  dataDetailVoucher: Partial<IGift>
  visibleAddReward: boolean
  visibleUpdateReward: boolean
  dataDetailReward: Partial<IRewardRespond>
  visibleAddTicket: boolean
  visibleImportTicket: boolean
  changeTabGift: (tab: string) => void
  changeVisibleAddVoucher: (visible: boolean) => void
  changeVisibleImportVoucher: (visible: boolean) => void
  changeVisibleUpdateVoucher: (visible: boolean) => void
  setDataDetailVoucher: (dataDetailVoucher: any) => void
  changeVisibleAddReward: (visible: boolean) => void
  changeVisibleUpdateReward: (visible: boolean) => void
  setDataDetailReward: (dataDetailReward: any) => void
  changeVisibleAddTicket: (visible: boolean) => void
  changeVisibleImportTicket: (visible: boolean) => void
}

export const useGiftStore = create<giftState>((set) => ({
  tabGift: "voucher",
  visibleAddVoucher: false,
  visibleImportVoucher: false,
  visibleUpdateVoucher: false,
  dataDetailVoucher: {},
  visibleAddReward: false,
  visibleUpdateReward: false,
  dataDetailReward: {},
  visibleAddTicket: false,
  visibleImportTicket: false,
  changeTabGift: (tab) => {
    localStorage.setItem('defaultTabGift', tab || '')
    set({ tabGift: tab })
  },
  changeVisibleAddVoucher: (visible) => set({ visibleAddVoucher: visible }),
  changeVisibleImportVoucher: (visible) => set({ visibleImportVoucher: visible }),
  changeVisibleUpdateVoucher: (visible) => set({ visibleUpdateVoucher: visible }),
  setDataDetailVoucher: (dataDetailVoucher: any) => set({ dataDetailVoucher }),
  changeVisibleAddReward: (visible) => set({ visibleAddReward: visible }),
  changeVisibleUpdateReward: (visible) => set({ visibleUpdateReward: visible }),
  setDataDetailReward: (dataDetailReward: any) => set({ dataDetailReward }),
  changeVisibleAddTicket: (visible) => set({ visibleAddTicket: visible }),
  changeVisibleImportTicket: (visible) => set({ visibleImportTicket: visible }),
}))

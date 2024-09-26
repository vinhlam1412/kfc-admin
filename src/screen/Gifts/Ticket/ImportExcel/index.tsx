import { Modal } from "antd"
import React from "react"
import { FormImport } from "./FormImport"
import { useGiftStore } from "@/store/usGift"
import { trans } from "@/locale"

export const ImportVoucher: React.FC = () => {
  const { visibleImportTicket, changeVisibleImportTicket } = useGiftStore()

  return (
    <Modal
      destroyOnClose
      title={trans("gift.import_excel")}
      open={visibleImportTicket}
      width={670}
      footer={null}
      onCancel={() => {
        changeVisibleImportTicket(false)
      }}>
      <FormImport />
    </Modal>
  )
}

import { Modal } from "antd"
import React from "react"
import { FormImport } from "./FormImport"
import { useGiftStore } from "@/store/usGift"
import { trans } from "@/locale"

export const ImportVoucher: React.FC = () => {
  const { visibleImportVoucher, changeVisibleImportVoucher } = useGiftStore()

  return (
    <Modal
      destroyOnClose
      title={trans("gift.import_excel")}
      open={visibleImportVoucher}
      width={670}
      footer={null}
      onCancel={() => {
        changeVisibleImportVoucher(false)
      }}>
      <FormImport />
    </Modal>
  )
}

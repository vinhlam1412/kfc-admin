import React, { useState } from "react"
import DefaultLayout from "@/component/Layout/Default"
import { Card, Tabs } from "antd"
import type { TabsProps } from "antd"
import { filter } from "lodash"
import { giftsCss } from "./style"
import { Vouchers } from "@screen/Gifts/Voucher"
import { Artifacts } from "@screen/Gifts/Artifacts"
import { useGiftStore } from "@/store/usGift"
import { trans } from "@/locale"
import { useSearchParams } from "react-router-dom"
import { Tickets } from "./Ticket"

export const Gifts: React.FC = () => {
  const { changeTabGift } = useGiftStore()
  const [, setSearchParams] = useSearchParams()

  const [currentTab, setCurrentTab] = useState(localStorage.getItem("defaultTabGift") || "voucher")

  const listItems: TabsProps["items"] = [
    {
      key: "voucher",
      label: trans("gift.digital_reward"),
      children: <Vouchers />,
      disabled: false,
    },
    {
      key: "artifacts",
      label: trans("gift.physical_reward"),
      children: <Artifacts />,
      disabled: false,
    },
    {
      key: "ticket",
      label: trans("gift.tickets"),
      children: <Tickets />,
      disabled: false,
    },
  ]

  const onChange = (e: string) => {
    setCurrentTab(e)
    changeTabGift(e)
    setSearchParams({})
  }

  return (
    <DefaultLayout>
      <Card
        css={giftsCss}
        className="space-layout">
        <Tabs
          activeKey={currentTab}
          onChange={onChange}
          items={filter(listItems, { disabled: false })}
        />
      </Card>
    </DefaultLayout>
  )
}

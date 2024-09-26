import React, { useEffect, useMemo, useState } from "react"
import DefaultLayout from "@/component/Layout/Default"
import { Card, Select, Tabs } from "antd"
import type { TabsProps } from "antd"
import { filter, get } from "lodash"
import { giftsCss } from "./style"
import { GiftRegion } from "@/screen/Settings/GiftRegion"
import { WeeklyReward } from "@/screen/Settings/WeeklyReward"
import { useSettingStore } from "@/store/usSetting"
import { useAllEvent, useGameConfigAllQuery } from "@/hook/useGameConfig"
import { ProductForProgram } from "./ProductForProgram"
import { trans } from "@/locale"

export const Settings: React.FC = () => {
  const [event, setEvent] = useState<any>()
  const { changeTabSetting } = useSettingStore()
  const { data: gameConfigAll, isLoading } = useGameConfigAllQuery(event, event ? true : false)
  const { data: events } = useAllEvent()
  const dataGiftConfig = useMemo(() => get(gameConfigAll?.data, "0.metadata.locations"), [gameConfigAll?.data])
  const dataRewardConfig = useMemo(() => get(gameConfigAll?.data, "0.metadata.commoms"), [gameConfigAll?.data])
  const dataProductConfig = useMemo(() => get(gameConfigAll?.data, "0.metadata.combos"), [gameConfigAll?.data])

  const [currentTab, setCurrentTab] = useState(localStorage.getItem("defaultTabSetting") || "giftRegion")

  useEffect(() => {
    if (events?.data) {
      const item = events?.data.find(el => el.is_start === true)
      if (item) setEvent(item.id)
    }
  }, [events])

  const listItems: TabsProps["items"] = [
    {
      key: "giftRegion",
      label: trans("setting.location"),
      children: (
        <GiftRegion
          data={dataGiftConfig || []}
          isLoading={isLoading}
          config={gameConfigAll?.data ? gameConfigAll?.data[0] : null}
          event={event}
        />
      ),
      disabled: false,
    },
    {
      key: "weeklyPrizes",
      label: trans("setting.period"),
      children: (
        <WeeklyReward
          data={dataRewardConfig}
          isLoading={isLoading}
          config={gameConfigAll?.data ? gameConfigAll?.data[0] : null}
          event={event}
        />
      ),
      disabled: false,
    },
    {
      key: "productForProgram",
      label: trans("setting.combo"),
      children: (
        <ProductForProgram
          data={dataProductConfig || []}
          isLoading={isLoading}
          config={gameConfigAll?.data ? gameConfigAll?.data[0] : null}
          event={event}
        />
      ),
      disabled: false,
    },
  ]

  const onChange = (e: string) => {
    setCurrentTab(e)
    changeTabSetting(e)
  }

  const handleChangeEvent = (value: any) => {
    setEvent(value)
  }

  return (
    <DefaultLayout>
      <Card
        css={giftsCss}
        className="space-layout">
        <Select
          showSearch
          options={events?.data ? events?.data : []}
          fieldNames={{ label: "name", value: "id" }}
          className="w-[300px]"
          value={event}
          onChange={handleChangeEvent}
        />
        <Tabs
          activeKey={currentTab}
          onChange={onChange}
          items={filter(listItems, { disabled: false })}
        />
      </Card>
    </DefaultLayout>
  )
}

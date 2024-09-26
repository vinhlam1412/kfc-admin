import React, { useState } from "react"
import List from "./List"
import { useSearchParams } from "react-router-dom"
import { PAGINATION } from "@/config/constant"
import { calculateFromTo } from "@/util/Common"
import { IGiftQuery } from "@/domain/Gift"
import { Button } from "antd"
import { useGiftStore } from "@/store/usGift"
import { AddTicket } from "./AddTicket"
import { trans } from "@/locale"
import { ImportVoucher } from "./ImportExcel"
import { useTicketsQuery } from "@/hook/useTicket"

export const Tickets: React.FC = () => {
  const { changeVisibleAddTicket, changeVisibleImportTicket } = useGiftStore()

  const [searchParams, setSearchParams] = useSearchParams()
  const oldSearch: any = Object.fromEntries(searchParams.entries())
  const pageCurrent = calculateFromTo(oldSearch?.page || PAGINATION.DEFAULT_CURRENT_PAGE,oldSearch?.pageSize || PAGINATION.DEFAULT_PAGE_SIZE)

  const [ticketsQuery, setTicketsQuery] = useState<IGiftQuery>({ from: pageCurrent?.from || 0, to: pageCurrent?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1 })

  const { data: list, isLoading } = useTicketsQuery(ticketsQuery)

  const handleChangePage = (page: number, pageSize: number) => {
    const result = calculateFromTo(page, pageSize)
    const params: any = {
      ...oldSearch,
      page: !searchParams.has("pageSize") || Number(oldSearch.pageSize) === Number(pageSize) ? page : PAGINATION.DEFAULT_CURRENT_PAGE,
      pageSize,
    }

    setTicketsQuery({ from: result?.from || 0, to: result?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1 })
    setSearchParams(params)
  }

  const handleShowModalAdd = () => {
    changeVisibleAddTicket(true)
  }

  const handleShowModalImport = () => {
    changeVisibleImportTicket(true)
  }

  return (
    <div className="pb-4 pt-6 relative">
      <List
      data={list} isLoading={isLoading} handleChangePage={handleChangePage} oldSearch={oldSearch}
      />
      <div className="m-0 ml-2 absolute -top-[52px] right-0">
        <Button
          type="primary"
          className="mr-2"
          onClick={handleShowModalImport}
          icon={<i className="fa-solid fa-cloud-arrow-up mr-1" />}>
          {trans("gift.import_excel")}
        </Button>
        <Button
          type="primary"
          onClick={handleShowModalAdd}
          icon={<i className="fa-solid fa-plus mr-1" />}>
          {trans("gift.add_ticket")}
        </Button>
      </div>
      <AddTicket />
      <ImportVoucher />
    </div>
  )
}

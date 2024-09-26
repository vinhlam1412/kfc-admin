import React, { useState } from "react"
import DefaultLayout from "@/component/Layout/Default"
import List from "./List"
import { Card, Skeleton } from "antd"
import { Filter } from "./Filter"
import { usePlayersQuery } from "@/hook/usePlayers"
import { useSearchParams } from "react-router-dom"
import { PAGINATION } from "@/config/constant"
import { calculateFromTo } from "@/util/Common"
import { IPlayerQuery } from "@/domain/Players"

export const User: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const oldSearch: any = Object.fromEntries(searchParams.entries())
  const pageCurrent = calculateFromTo(oldSearch?.page || PAGINATION.DEFAULT_CURRENT_PAGE,oldSearch?.pageSize || PAGINATION.DEFAULT_PAGE_SIZE)

  const [playersQuery, setPlayersQuery] = useState<IPlayerQuery>({ from: pageCurrent?.from || 0, to: pageCurrent?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1, text: "" })

  const { data: list, isLoading } = usePlayersQuery(playersQuery)

  const handleChangePage = (page: number, pageSize: number) => {
    const result = calculateFromTo(page, pageSize)
    const params: any = {
      ...oldSearch,
      page: !searchParams.has("pageSize") || Number(oldSearch.pageSize) === Number(pageSize) ? page : PAGINATION.DEFAULT_CURRENT_PAGE,
      pageSize,
    }

    setPlayersQuery({ from: result?.from || 0, to: result?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1, text: oldSearch?.keyword || "" })
    setSearchParams(params)
  }

  return (
    <DefaultLayout>
      <Card
        title={
          <Filter
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            setPlayersQuery={setPlayersQuery}
            playersQuery={playersQuery}
          />
        }
        className="space-layout">
        {isLoading ? <Skeleton /> : <List data={list} isLoading={isLoading} handleChangePage={handleChangePage} oldSearch={oldSearch} />}
      </Card>
    </DefaultLayout>
  )
}

import React, { useState } from "react"
import List from "./List"
import { useSearchParams } from "react-router-dom"
import { useRewardQuery } from "@/hook/useReward"
import { PAGINATION } from "@/config/constant"
import { IRewardQuery } from "@/domain/Gift"
import { calculateFromTo } from "@/util/Common"
import { useGiftStore } from "@/store/usGift"
import { Button } from "antd"
import { AddReward } from "./AddReward"
import { UpdateReward } from "./UpdateReward"
import { trans } from "@/locale"

export const Artifacts: React.FC = () => {
  const { changeVisibleAddReward } = useGiftStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const oldSearch: any = Object.fromEntries(searchParams.entries())
  const pageCurrent = calculateFromTo(oldSearch?.page || PAGINATION.DEFAULT_CURRENT_PAGE,oldSearch?.pageSize || PAGINATION.DEFAULT_PAGE_SIZE)

  const [artifactsQuery, setArtifactsQuery] = useState<IRewardQuery>({ from: pageCurrent?.from || 0, to: pageCurrent?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1, name: "" })

  const { data: list, isLoading } = useRewardQuery(artifactsQuery)

  const handleChangePage = (page: number, pageSize: number) => {
    const result = calculateFromTo(page, pageSize)
    const params: any = {
      ...oldSearch,
      page: !searchParams.has("pageSize") || Number(oldSearch.pageSize) === Number(pageSize) ? page : PAGINATION.DEFAULT_CURRENT_PAGE,
      pageSize,
    }

    setArtifactsQuery({ from: result?.from || 0, to: result?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1, name: oldSearch?.keyword || "" })
    setSearchParams(params)
  }

  const handleShowModal = () => {
    changeVisibleAddReward(true)
  }

  return (
    <div className="pb-4 pt-6 relative">
      <List data={list} isLoading={isLoading} handleChangePage={handleChangePage} oldSearch={oldSearch} />
      <div className="m-0 ml-2 absolute -top-[52px] right-0">
        <Button
          type="primary"
          onClick={handleShowModal}
          icon={<i className="fa-solid fa-plus mr-1" />}>
          {trans("reward.add_gift")}
        </Button>
      </div>
      <AddReward />
      <UpdateReward />
    </div>
  )
}

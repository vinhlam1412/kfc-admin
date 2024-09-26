import React, { useRef, useState } from "react"
import List from "./List"
import DefaultLayout from "@/component/Layout/Default"
import { Button, Card, Col, Row, message } from "antd"
import { useShopStore } from "@/store/useShop"
import { AddShop } from "./AddShop"
import { useSearchParams } from "react-router-dom"
import { useImportStore, useStoresQuery } from "@/hook/useStore"
import { IStoresQuery } from "@/domain/Store"
import { PAGINATION } from "@/config/constant"
import { calculateFromTo } from "@/util/Common"
import { UpdateShop } from "./UpdateShop"
import { trans } from "@/locale"
import readXlsxFile from "read-excel-file"
import { isEqual } from "lodash"

export const ManageShop: React.FC = () => {
  const { changeVisible } = useShopStore()
  const fileInputRef = useRef<any>(null)

  const handleShowModal = () => {
    changeVisible(true)
  }

  const [searchParams, setSearchParams] = useSearchParams()
  const oldSearch: any = Object.fromEntries(searchParams.entries())
  const pageCurrent = calculateFromTo(oldSearch?.page || PAGINATION.DEFAULT_CURRENT_PAGE, oldSearch?.pageSize || PAGINATION.DEFAULT_PAGE_SIZE)

  const [storesQuery, setStoresQuery] = useState<IStoresQuery>({
    from: pageCurrent?.from || 0,
    to: pageCurrent?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1,
    text: "",
  })

  const { data: list, isLoading } = useStoresQuery(storesQuery)
  const importExcel = useImportStore()

  const handleChangePage = (page: number, pageSize: number) => {
    const result = calculateFromTo(page, pageSize)
    const params: any = {
      ...oldSearch,
      page: !searchParams.has("pageSize") || Number(oldSearch.pageSize) === Number(pageSize) ? page : PAGINATION.DEFAULT_CURRENT_PAGE,
      pageSize,
    }

    setStoresQuery({ from: result?.from || 0, to: result?.to || PAGINATION.DEFAULT_PAGE_SIZE - 1, text: oldSearch?.keyword || "" })
    setSearchParams(params)
  }

  const handleImport = () => {
    document.getElementById("uploadFileStore")?.click()
  }

  const validateImportFileHeaders = (fileHeaders: any, expectHeaders: string[]) => {
    const isEqualData = isEqual(fileHeaders, expectHeaders)
    return isEqualData
  }

  const handleImportStore = (e: any) => {
    console.log("values", e)
    if (e.target.files && e.target.files[0]) {
      readXlsxFile(e.target.files[0]).then((data) => {
        const headers = data?.shift()

        const validateHeaderErrors: boolean = validateImportFileHeaders(headers, ["STT", "STORE NAME", "STORE ID", "STORE ID NUMBER", "AREA"])

        if (!validateHeaderErrors) {
          message.error(trans("file.invalid_format"))
          return
        }
        const dataRequest = []
        for (const item of data) {
          if (item?.[1] == null || item?.[2] == null || item?.[3] == null || item?.[4] == null) {
            message.error(trans("file.format_require"))
            dataRequest.length = 0
            return
          }
          dataRequest.push({
            address: "",
            area: item?.[4],
            name: item?.[1],
            code: item?.[2],
            store_id: Number(item?.[3]),
          })
        }

        importExcel.mutateAsync(dataRequest).then((result: any) => {
          if (result?.status === 201) {
            message.success(trans("message.success"))
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          } else {
            message.error(result?.error?.message || trans("message.fail"))
          }
        })
      })
    }
  }

  return (
    <DefaultLayout>
      <Card
        className="space-layout"
        extra={
          <Row gutter={20}>
            <Col>
              <Button
                type="primary"
                onClick={handleShowModal}
                icon={<i className="fa-solid fa-plus mr-2" />}>
                {trans("store.add")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                className="mr-2"
                onClick={handleImport}
                icon={<i className="fa-solid fa-cloud-arrow-up mr-1" />}>
                {trans("gift.import_excel")}
              </Button>
            </Col>
          </Row>
        }>
        <List
          data={list}
          isLoading={isLoading}
          handleChangePage={handleChangePage}
          oldSearch={oldSearch}
        />
        <AddShop />
        <UpdateShop />
        <input
          hidden
          className="!hidden"
          ref={fileInputRef}
          type="file"
          id="uploadFileStore"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          value=""
          onChange={handleImportStore}
        />
      </Card>
    </DefaultLayout>
  )
}

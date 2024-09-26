import React, { useMemo } from "react"
import { Table, Tag } from "antd"
import { filter } from "lodash"
import { trans } from "@/locale"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { PAGINATION } from "@/config/constant"

interface Props {
  isLoading?: boolean
  data?: PostgrestSingleResponse<any[]> | undefined
  handleChangePage?: (page: number, pageSize: number) => void
  oldSearch: any
}

const List = (props: Props) => {

  const columns: any[] = useMemo(
    () => [
      {
        title: "No",
        className: "bold-400",
        dataIndex: "no",
        key: "no",
        fixed: "left",
        disabled: false,
        width: 60,
        render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
      },
      {
        title: "Name",
        className: "bold-400",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 150,
      },
      {
        title: trans("gift_ticket.serial_no"),
        className: "bold-400",
        dataIndex: "serial_no",
        key: "serial_no",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: () => <span className="text-gray-500">********</span>
      },
      {
        title: trans("gift_ticket.pin_no"),
        className: "bold-400",
        dataIndex: "pin_no",
        key: "pin_no",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: () => <span className="text-gray-500">*****</span>
      },
      {
        title: trans("game.status"),
        className: "bold-400",
        dataIndex: "is_gift",
        key: "is_gift",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (is_gift: any) => <Tag color={is_gift ? "gray" : "blue"}>{is_gift ? trans("gift.given") : trans("gift.not_given")}</Tag>,
      },
      {
        title: "Campaigns",
        className: "bold-400",
        dataIndex: "events",
        key: "events",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (event: any) => event ? event.name : <span className="text-gray-300">--</span>
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
      <Table
        rowKey={"id"}
        loading={props?.isLoading}
        columns={filter(columns, (iFil: any) => !iFil?.disabled)}
        dataSource={props?.data?.data || []}
        className="bd-radius-5"
        scroll={{
            x: true,
        }}
        locale={{
          emptyText: trans("table.empty"),
        }}
        pagination={{
            pageSize: props?.oldSearch?.pageSize || PAGINATION.DEFAULT_PAGE_SIZE,
            total: props?.data?.count || 0,
            current: props?.oldSearch.page || PAGINATION.DEFAULT_CURRENT_PAGE,
            pageSizeOptions: PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS,
            showSizeChanger: true,
            onChange: props?.handleChangePage,
            locale: {
                items_per_page: `/ ${trans("page.page_change")}`,
            },
        }}
      />
  )
}

export default List

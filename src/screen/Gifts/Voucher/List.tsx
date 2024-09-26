import React, { useMemo } from "react"
import { Button, Modal, Table, Tag, Tooltip, message } from "antd"
import { filter } from "lodash"
import { IGift } from "@/domain/Gift"
import { formatDateFull } from "@/util/Common"
import { useDeleteVoucher } from "@/hook/useGift"
import { useGiftStore } from "@/store/usGift"
import { trans } from "@/locale"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { PAGINATION } from "@/config/constant"

interface Props {
  isLoading?: boolean
  data?: PostgrestSingleResponse<IGift[]> | undefined
  handleChangePage?: (page: number, pageSize: number) => void
  oldSearch: any
}

const List = (props: Props) => {
  const { setDataDetailVoucher, changeVisibleUpdateVoucher } = useGiftStore()
  const deleteVoucher = useDeleteVoucher()

  const onDeleteVoucher = (id: number) => {
    deleteVoucher.mutateAsync(id).then((result: any) => {
      if (result?.status === 200) {
        message.success(trans("message.success"))
      }
    })
  }

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
        render: (_: any, record: IGift, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
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
        title: trans("gift.voucher"),
        className: "bold-400",
        dataIndex: "code",
        key: "code",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: () => <span className="text-gray-500">********</span>
      },
      {
        title: "Barcode/QRcode",
        className: "bold-400",
        dataIndex: "barcode",
        key: "barcode",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: () => <span className="text-gray-500">*****</span>
      },
      {
        title: trans("campaign.start_day"),
        dataIndex: "started_at",
        key: "started_at",
        ellipsis: true,
        disabled: false,
        render: (started_at: string) => (started_at ? formatDateFull(started_at) : <span className="text-gray-300">--</span>),
        width: 200,
      },
      {
        title: trans("campaign.end_date"),
        dataIndex: "ended_at",
        key: "ended_at",
        ellipsis: true,
        disabled: false,
        render: (ended_at: string) => (ended_at ? formatDateFull(ended_at) : <span className="text-gray-300">--</span>),
        width: 200,
      },
      {
        title: trans("game.status"),
        className: "bold-400",
        dataIndex: "is_give",
        key: "is_give",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (is_give: any) => <Tag color={is_give ? "gray" : "blue"}>{is_give ? trans("gift.given") : trans("gift.not_given")}</Tag>,
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
      {
        title: trans("game.action"),
        key: "action",
        fixed: "right",
        disabled: true,
        align: "center",
        width: 100,
        render: (record: IGift) => (
          <div className="flex justify-center">
            <Tooltip title={trans("gift.update_voucher")}>
              <Button
                className="hover:!border-[#3498db] mr-2"
                onClick={() => {
                  setDataDetailVoucher(record)
                  changeVisibleUpdateVoucher(true)
                }}
                type="default"
                icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
              />
            </Tooltip>
            <Tooltip title={trans("gift.delete_voucher")}>
              <Button
                type="default"
                icon={<i className="fa-light fa-trash text-[#e8262d]" />}
                onClick={() => {
                  Modal.confirm({
                    title: trans("admin.title_confirm_delete"),
                    okText: trans("button.confirm"),
                    cancelText: trans("button.cancel"),
                    onOk: () => {
                      onDeleteVoucher(record.id)
                    },
                  })
                }}
              />
            </Tooltip>
          </div>
        ),
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

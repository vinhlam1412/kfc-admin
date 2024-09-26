import React, { useMemo } from "react"
import { Button, Modal, Table, Tooltip, message } from "antd"
import { filter } from "lodash"
import { IStores } from "@/domain/Store"
import { useDeleteStore } from "@/hook/useStore"
import { useShopStore } from "@/store/useShop"
import { formatDateFull } from "@/util/Common"
import { trans } from "@/locale"
import { PAGINATION } from "@/config/constant"
import { PostgrestSingleResponse } from "@supabase/supabase-js"

interface Props {
  isLoading?: boolean
  data?: PostgrestSingleResponse<IStores[]> | undefined
  handleChangePage?: (page: number, pageSize: number) => void
  oldSearch: any
}

const List = (props: Props) => {
  const { setDataDetailStore, changeVisibleUpdate } = useShopStore()
  const deleteStore = useDeleteStore()

  const onDeleteStore = (id: number) => {
    deleteStore.mutateAsync(id).then((result: any) => {
      if (result?.status === 204) {
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
        render: (_: any, record: IStores, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
      },
      {
        title: "ID",
        className: "bold-400",
        dataIndex: "id",
        key: "id",
        fixed: "left",
        ellipsis: true,
        disabled: true,
        width: 100,
        render: (id: string) => (id ? id : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("store.name"),
        className: "bold-400",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (name: string) => (name ? name : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("store.address"),
        className: "bold-400",
        dataIndex: "address",
        key: "address",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (address: string) => (address ? address : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("store.code"),
        className: "bold-400",
        dataIndex: "code",
        key: "code",
        ellipsis: true,
        disabled: false,
        width: 120,
        render: (code: number | string) => (code ? code : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("store.id"),
        className: "bold-400",
        dataIndex: "store_id",
        key: "store_id",
        ellipsis: true,
        disabled: false,
        width: 120,
        render: (store_id: number) => (store_id ? store_id : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("setting.area"),
        className: "bold-400",
        dataIndex: "area",
        key: "area",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (area: string) => (area ? area : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("game.date_created"),
        className: "bold-400",
        dataIndex: "created_at",
        key: "created_at",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (created_at: string) => (created_at ? formatDateFull(created_at) : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("store.update_at"),
        className: "bold-400",
        dataIndex: "updated_at",
        key: "updated_at",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (updated_at: string) => (updated_at ? updated_at : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("game.active"),
        key: "action",
        disabled: false,
        align: "center",
        fixed: "right",
        width: 100,
        render: (record: IStores) => (
          <div className="flex justify-center">
            <Tooltip title={trans("store.update")}>
              <Button
                className="hover:!border-[#3498db] mr-2"
                onClick={() => {
                  setDataDetailStore(record)
                  changeVisibleUpdate(true)
                }}
                type="default"
                icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
              />
            </Tooltip>
            <Tooltip title={trans("store.delete")}>
              <Button
                type="default"
                icon={<i className="fa-light fa-trash text-[#e8262d]" />}
                onClick={() => {
                  Modal.confirm({
                    title: trans("admin.title_confirm_delete"),
                    okText: trans("button.confirm"),
                    cancelText: trans("button.cancel"),
                    onOk: () => {
                      onDeleteStore(record.id)
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

import React, { useMemo } from "react"
import { Button, Image, Modal, Table, Tag, Tooltip, message } from "antd"
import { filter } from "lodash"
import { IRewardRespond } from "@/domain/Gift"
import DefaultAvatarImg from "@assets/img/9.jpg"
import { convertNumberToCurrency, formatDateFull } from "@/util/Common"
import { useDeleteReward } from "@/hook/useReward"
import { useGiftStore } from "@/store/usGift"
import { trans } from "@/locale"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { PAGINATION } from "@/config/constant"

interface Props {
  isLoading?: boolean
  data?: PostgrestSingleResponse<IRewardRespond[]> | undefined
  handleChangePage?: (page: number, pageSize: number) => void
  oldSearch: any
}

const List = (props: Props) => {
  const { setDataDetailReward, changeVisibleUpdateReward } = useGiftStore()
  const deleteReward = useDeleteReward()

  const onDeleteReward = (id: number) => {
    deleteReward.mutateAsync(id).then((result: any) => {
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
        render: (_: any, record: IRewardRespond, index: number) => (record ? index + 1 : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("player.name"),
        className: "bold-400",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        ellipsis: true,
        disabled: false,
        width: 220,
        render: (name: string) => (name ? name : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("reward.image"),
        className: "bold-400",
        dataIndex: "image",
        key: "image",
        disabled: false,
        width: 150,
        render: (image: string) =>
          image ? (
            <div className="flex">
              <Image
                src={image ? image : DefaultAvatarImg}
                width={60}
              />
            </div>
          ) : (
            <span className="text-gray-300">--</span>
          ),
      },
      {
        title: trans("reward.price"),
        className: "bold-400",
        dataIndex: "price",
        key: "price",
        ellipsis: true,
        disabled: true,
        width: 150,
        render: (price: string | number) => (price ? convertNumberToCurrency(price) : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("reward_config.quantity"),
        className: "bold-400",
        dataIndex: "quantity",
        key: "quantity",
        ellipsis: true,
        disabled: false,
        width: 100,
        render: (quantity: any) => (quantity ? quantity : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("reward.type"),
        className: "bold-400",
        dataIndex: "type",
        key: "type",
        ellipsis: true,
        disabled: true,
        width: 150,
        render: (type: any) => (type ? type : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("game.status"),
        className: "bold-400",
        dataIndex: "is_active",
        key: "is_active",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (is_active: string) => (is_active ? <Tag color="green">{trans('game.active')}</Tag> : <Tag color="volcano">{trans('status.inactive')}</Tag>),
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
        disabled: false,
        align: "center",
        width: 100,
        render: (record: any) => (
          <div className="flex justify-center">
            <Tooltip title={trans("reward.update_gift")}>
              <Button
                className="hover:!border-[#3498db] mr-2"
                onClick={() => {
                  setDataDetailReward(record)
                  changeVisibleUpdateReward(true)
                }}
                type="default"
                icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
              />
            </Tooltip>
            <Tooltip title={trans("reward.delete_gift")}>
              <Button
                type="default"
                icon={<i className="fa-light fa-trash text-[#e8262d]" />}
                onClick={() => {
                  Modal.confirm({
                    title: trans("admin.title_confirm_delete"),
                    okText: trans("button.confirm"),
                    cancelText: trans("button.cancel"),
                    onOk: () => {
                      onDeleteReward(record.id)
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
        x: 1300,
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

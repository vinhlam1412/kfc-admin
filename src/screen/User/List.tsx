import React, { useMemo } from "react"
import { Button, Image, Modal, Table, Tooltip, message } from "antd"
import { filter } from "lodash"
import { formatDateMedium, formatDateShort } from "@/util/Common"
import DefaultAvatarImg from "@assets/img/9.jpg"
import { Link } from "react-router-dom"
import { IPlayer, IUpdatePlayer } from "@/domain/Players"
import { trans } from "@/locale"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { PAGINATION } from "@/config/constant"
import { useUpdatePlayer } from "@/hook/usePlayers"

interface Props {
  isLoading?: boolean
  data?: PostgrestSingleResponse<IPlayer[]> | undefined
  handleChangePage?: (page: number, pageSize: number) => void
  oldSearch: any
}

const List = (props: Props) => {
  const updatePlayer = useUpdatePlayer()

  const columns: any[] = useMemo(() => {
    const onUpdatePlayer = (record: IPlayer) => {
      const dataRequest: { params: IUpdatePlayer; id: number } = {
        params: {
          is_block: false,
          expired_block: null,
        },
        id: Number(record?.id),
      }
      updatePlayer.mutateAsync(dataRequest).then((result: any) => {
        if (result?.status === 200) {
          message.success(trans("message.success"))
        } else {
          message.error(result?.error?.message || trans("message.fail"))
        }
      })
    }

    return [
      {
        title: "No",
        className: "bold-400",
        dataIndex: "no",
        key: "no",
        fixed: "left",
        disabled: false,
        width: 60,
        render: (_: any, record: IPlayer, index: number) => (record ? index + 1 : <span className="text-gray-300">--</span>),
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
        title: <div className="ml-5">{trans("player.zalo_account")}</div>,
        className: "bold-400",
        key: "user",
        fixed: "left",
        disabled: false,
        ellipsis: true,
        width: 150,
        render: (record: IPlayer) =>
          record ? (
            <div className="flex items-center">
              <div className="shrink-0 pr-2">
                <Image
                  className="rounded-[50%]"
                  src={record?.avatar ? record?.avatar : DefaultAvatarImg}
                  width={60}
                />
              </div>
              <div className="flex-1">
                <p className="my-2 text-left text-[#8c9097] break-words">{record?.name || "--"}</p>
                <p className="my-2 text-left font-semibold break-words">{record?.phone || "--"}</p>
              </div>
            </div>
          ) : (
            <span className="text-gray-300">--</span>
          ),
      },
      {
        title: trans("player.name"),
        className: "bold-400",
        dataIndex: "alternative_name",
        key: "alternative_name",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (alternativeName: any) =>
          alternativeName ? <div className="flex items-center">{alternativeName}</div> : <span className="text-gray-300">--</span>,
      },
      {
        title: trans("player.phone"),
        className: "bold-400",
        dataIndex: "alternative_phone",
        key: "alternative_phone",
        ellipsis: true,
        disabled: false,
        width: 150,
        render: (alternativePhone: any) => (alternativePhone ? <p>{alternativePhone}</p> : <span className="text-gray-300">--</span>),
      },
      {
        title: "Email",
        className: "bold-400",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
        disabled: true,
        width: 150,
        render: (email: any) => (email ? <p>{email}</p> : <span className="text-gray-300">--</span>),
      },
      {
        title: "Following OA",
        className: "bold-400",
        dataIndex: "is_following_oa",
        key: "is_following_oa",
        ellipsis: true,
        disabled: true,
        width: 150,
        render: (is_following_oa: any) => `${is_following_oa}`,
      },
      {
        title: trans("player.birthday"),
        dataIndex: "date_of_birth",
        key: "date_of_birth",
        ellipsis: true,
        disabled: false,
        render: (date_of_birth: string) => (date_of_birth ? formatDateShort(date_of_birth) : <span className="text-gray-300">--</span>),
        width: 110,
      },
      {
        title: trans("admin.last_sign_in_at"),
        key: "loggined_at",
        dataIndex: "loggined_at",
        ellipsis: true,
        disabled: false,
        render: (loggined_at: string) => (loggined_at ? formatDateMedium(loggined_at) : <span className="text-gray-300">N/A</span>),
        width: 110,
      },
      {
        title: trans("player.block"),
        dataIndex: "is_block",
        key: "is_block",
        fixed: "right",
        disabled: false,
        align: "center",
        width: 100,
        render: (is_block: boolean, record: IPlayer) =>
          is_block ? (
            <div className="flex justify-center">
              <Tooltip title={trans("player.update")}>
                <Button
                  className="hover:!border-[#3498db] mr-2"
                  onClick={() => {
                    Modal.confirm({
                      title: trans("player.title_confirm_unblock"),
                      okText: trans("button.confirm"),
                      cancelText: trans("button.cancel"),
                      onOk: () => {
                        onUpdatePlayer(record)
                        console.log("haha", record)
                      },
                    })
                  }}
                  type="default"
                  icon={<i className="fa-solid fa-flag text-[#3498db]" />}
                />
              </Tooltip>
            </div>
          ) : (
            ""
          ),
      },
      {
        title: trans("game.action"),
        key: "action",
        align: "center",
        fixed: "right",
        ellipsis: true,
        disabled: false,
        render: (record: IPlayer) =>
          record?.id ? <Link to={`/users/${record?.id}`}>{trans("player.see_detail")}</Link> : <span className="text-gray-300">--</span>,
        width: 120,
      },
    ]
  }, [updatePlayer])

  return (
    <>
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
    </>
  )
}

export default List

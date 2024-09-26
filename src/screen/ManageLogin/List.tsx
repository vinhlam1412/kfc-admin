import React, { useMemo } from "react"
import { Button, Modal, Table, Tooltip, message } from "antd"
import { filter } from "lodash"
import { formatDateFull } from "@/util/Common"
import { useDeleteUser } from "@/hook/useUser"
// import { useUserStore } from "@/store/useUser"
import { trans } from "@/locale"

interface Props {
  isLoading?: boolean
  data?: any[]
}

const List = (props: Props) => {
  // const { setDataDetailAccount, changeVisibleUpdateAccount } = useUserStore()
  const deleteVoucher = useDeleteUser()

  const onDeleteUser = (id: string) => {
    deleteVoucher.mutateAsync(id).then((result: any) => {
      if (result?.status === 200) {
        message.success(trans("message.success"))
      }
    })
  }

  const columns: any[] = useMemo(
    () => [
      {
        title: "STT",
        className: "bold-400",
        dataIndex: "stt",
        key: "stt",
        fixed: "left",
        disabled: false,
        width: 60,
        render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
      },
      {
        title: trans("admin.name"),
        className: "bold-400",
        dataIndex: "name",
        key: "name",
        disabled: false,
        width: 200,
        render: (name: any) => name ? <div className="flex items-center">{name}</div> : <span className="text-gray-300">--</span>,
      },
      {
        title: "Email",
        className: "bold-400",
        dataIndex: "email",
        ellipsis: true,
        disabled: false,
        width: 200,
        render: (email: any) =>
          email ? <p>{email}</p> : <span className="text-gray-300">--</span>,
      },
      {
        title: trans("admin.last_sign_in_at"),
        dataIndex: "last_sign_in_at",
        key: "last_sign_in_at",
        align: "center",
        default: true,
        render: (last_sign_in_at: string) => (last_sign_in_at ? formatDateFull(last_sign_in_at) : <span className="text-gray-300">--</span>),
        width: 120,
      },
      {
        title: trans("game.active"),
        key: "action",
        align: "center",
        default: true,
        render: (record: any) => (
          <div className="flex justify-center">
            {/* <Tooltip title={trans("admin.update_account")}>
              <Button
                className="hover:!border-[#3498db] mr-2"
                onClick={() => {
                  setDataDetailAccount(record)
                  changeVisibleUpdateAccount(true)
                }}
                type="default"
                icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
              />
            </Tooltip> */}
            <Tooltip title={trans("admin.delete_account")}>
              <Button
                type="default"
                icon={<i className="fa-light fa-trash text-[#e8262d]" />}
                onClick={() => {
                  Modal.confirm({
                    title: trans("admin.title_confirm_delete"),
                    okText: trans("button.confirm"),
                    cancelText: trans("button.cancel"),
                    onOk: () => {
                      onDeleteUser(record.id)
                    },
                  })
                }}
              />
            </Tooltip>
          </div>
        ),
        width: 120,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <>
      <Table
        rowKey={"id"}
        loading={props?.isLoading}
        columns={filter(columns, (iFil: any) => !iFil?.disabled)}
        dataSource={props?.data || []}
        className="bd-radius-5"
        locale={{
          emptyText: trans("table.empty"),
        }}
        pagination={false}
        scroll={{
          x: true,
        }}
      />
    </>
  )
}

export default List

import React, { useEffect, useState } from "react"
import DefaultLayout from "@/component/Layout/Default"
import { Button, Card, Image, message, Modal, Table, Tag, Tooltip } from "antd"
import Filter from "./Filter"
import { useSearchParams } from "react-router-dom"
import { PAGINATION } from "@/config/constant"
import { filter } from "lodash"
import { useDeleteGame, useGetListGame } from "@/hook/useGames"
import CreateGames from "./Create"
import { formatDateFull } from "@/util/Common"
import { trans } from "@/locale"

export const Games: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keywork, setKeywork] = useState<string>(Object.fromEntries(searchParams.entries())?.keywork || "")
  const [pageCurren, setPageCurren] = useState(2)

  const [open, setOpen] = useState(false)
  const [gameId, setGameId] = useState(0)
  const deleteGameMutation = useDeleteGame()

  const [params, setParams] = useState({
    pageFrom: (pageCurren - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
    pageTo: pageCurren * PAGINATION.DEFAULT_PAGE_SIZE - 1,
    text: keywork,
  })
  const { data: listGame, isLoading, refetch } = useGetListGame(params)

  useEffect(() => {
    setParams({ pageFrom: (pageCurren - 1) * PAGINATION.DEFAULT_PAGE_SIZE, pageTo: pageCurren * PAGINATION.DEFAULT_PAGE_SIZE - 1, text: keywork })
  }, [pageCurren, keywork])

  const resetData = () => {
    setTimeout(() => {
      refetch()
    }, 500)
  }

  const showModal = (id?: any) => {
    setGameId(id || 0)
    setOpen(true)
  }

  const onChangePage = (page: number) => {
    setPageCurren(page)
  }

  useEffect(() => {
    const oldSearch = Object.fromEntries(searchParams.entries())
    if (keywork !== oldSearch.keywork) {
      setPageCurren(1)
      setSearchParams({ keywork: keywork })
    }
    // eslint-disable-next-line
  }, [keywork])

  const hideModal = () => {
    setOpen(false)
  }

  const handleConfirmDelete = (id: number) => {
    deleteGameMutation.mutateAsync(id).then((result: any) => {
      if (result?.status === 204) {
        message.success(trans('campaign.success'))
        resetData()
      }
    })
  }

  const columns: any[] = [
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
        title: "ID",
        className: "bold-400",
        dataIndex: "id",
        key: "id",
        disabled: true,
        width: 50,
        render: (id: any) => <div className="flex items-center">{id}</div>,
    },
    {
        title: "Code",
        className: "bold-400",
        dataIndex: "code",
        key: "code",
        disabled: false,
        width: 100,
        render: (code: any) => <div className="flex items-center">{code}</div>,
    },
    {
        title: "Icon",
        className: "bold-400",
        dataIndex: "icon",
        key: "icon",
        disabled: false,
        width: 100,
        render: (icon: any) => <div className="flex"><Image src={icon} width={60}/></div>,
    },
    {
      title: "Game",
      className: "bold-400",
      dataIndex: "name",
      key: "name",
      disabled: false,
      width: 150,
      render: (name: any) => <div className="flex items-center">{name}</div>,
    },
    {
      title: trans('game.description'),
      className: "bold-400",
      dataIndex: "description",
      ellipsis: true,
      disabled: true,
      width: 250,
      render: (description: any) => (description ? <p className="line-clamp-1">{description}</p> : <span className="text-gray-300">--</span>),
    },
    {
      title: "Url game",
      dataIndex: "url",
      key: "url",
      align: "center",
      default: true,
      disabled: true,
      render: (url: string) => (url ? url : <span className="text-gray-300">--</span>),
      width: 120,
    },
    {
      title: trans('game.prioritize'),
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (priority: string) => (priority ? priority : <span className="text-gray-300">--</span>),
      width: 120,
    },
    {
      title: trans('game.status'),
      dataIndex: "is_active",
      key: "is_active",
      default: true,
      render: (is_active: string) => (is_active ? <Tag color="green">{trans('game.active')}</Tag> : <Tag color="volcano">{trans('game.stopped')}</Tag>),
      width: 100,
    },
    {
        title: trans('game.date_created'),
        dataIndex: "created_at",
        key: "created_at",
        default: true,
        render: (created_at: string) => (created_at ? formatDateFull(created_at) : <span className="text-gray-300">--</span>),
        width: 150,
    },
    {
      title: trans('game.action'),
      dataIndex: "id",
      key: "id",
      align: "center",
      default: true,
      render: (id: number) => (
        <>
          <div className="flex justify-center">
            <Tooltip title={trans('game.edit_game')}>
              <Button
                className="hover:!border-[#3498db] mr-2"
                onClick={() => {
                  showModal(id)
                  setGameId(id)
                }}
                type="default"
                icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
              />
            </Tooltip>
            <Tooltip title={trans('game.delete_game')}>
              <Button
                type="default"
                icon={<i className="fa-light fa-trash text-[#e8262d]" />}
                onClick={() => {
                  Modal.confirm({
                    title: trans('game.sure_delete_game'),
                    okText: trans('game.confirm'),
                    cancelText: trans('button.cancel'),
                    onOk: () => handleConfirmDelete(id),
                  })
                }}
              />
            </Tooltip>
          </div>
        </>
      ),
      width: 120,
    },
  ]

  return (
    <DefaultLayout>
      <Card
        title={
          <Filter
            setOpen={showModal}
            setKeywork={setKeywork}
          />
        }
        className="space-layout">
        <Table
          rowKey={"id"}
          columns={filter(columns, (iFil: any) => !iFil?.disabled)}
          dataSource={listGame?.data ? listGame?.data : []}
          className="bd-radius-5"
          loading={isLoading}
          pagination={{
            showSizeChanger: false,
            current: pageCurren,
            pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
            total: listGame?.count || 0,
            onChange: onChangePage
          }}
          locale={{
            emptyText: trans('game.table_empty'),
          }}
          scroll={{
            x: true,
          }}
        />
      </Card>
      {open && (
        <CreateGames
          openModal={open}
          gameId={gameId}
          setOpen={hideModal}
          resetData={resetData}
        />
      )}
    </DefaultLayout>
  )
}

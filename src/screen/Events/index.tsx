import React, { useEffect, useState } from "react"
import DefaultLayout from "@/component/Layout/Default"
import {  Button, Card, message, Modal, Switch, Table, Tooltip } from "antd"
import Filter from "./Filter"
import { useSearchParams } from "react-router-dom"
import { PAGINATION } from "@/config/constant"
import { filter } from "lodash"
import { useDeleteEvent, useGetListEvents, useUpdateEvent, useCheckStatus } from "@/hook/useEvents"
import { formatDateFull } from "@/util/Common"
import CreateEvent from "./Create"
import { trans } from "@/locale"

export const Events: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [keywork, setKeywork] = useState<string>(Object.fromEntries(searchParams.entries())?.keywork || "")
    const [pageCurren, setPageCurren] = useState(1)
    const deleteEventMutation = useDeleteEvent()
    const { mutate: changeStatus } = useUpdateEvent();
    const [listShow, setListShow] = useState<any>([])
    

    const [open, setOpen] = useState(false)
    const [eventId, setEventId] = useState(0)

    const [params, setParams] = useState({
        pageFrom: (pageCurren - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
        pageTo: pageCurren * PAGINATION.DEFAULT_PAGE_SIZE - 1,
        text: keywork,
    })
    const { data: listEvents, isLoading, refetch } = useGetListEvents(params)
    const { data: checkEvents, refetch: refetchStatus } = useCheckStatus(params)
    useEffect(() => {
        if (listEvents?.data?.length) {
            setListShow(listEvents?.data)
        }
    }, [listEvents])

    const onChangePage = (page: number) => {
        setPageCurren(page)
    }

    useEffect(() => {
        setParams({ pageFrom: (pageCurren - 1) * PAGINATION.DEFAULT_PAGE_SIZE, pageTo: pageCurren * PAGINATION.DEFAULT_PAGE_SIZE - 1, text: keywork })
    }, [pageCurren, keywork])

    const resetData = () => {
        setTimeout(() => {
            refetch()
        }, 500)
    }

    const showModal = (id?: any) => {
        setEventId(id || 0)
        setOpen(true)
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
        deleteEventMutation.mutateAsync(id).then((result: any) => {
          if (result?.status === 204) {
            message.success(trans('campaign.success'))
            resetData()
          }
        })
    }

    const onChangeStatus = async (checked: boolean, eventId: number) => {
        if (checkEvents?.data?.length !== 0 && checked) {
            Modal.confirm({
                title: trans('campaign.notifycation_confirm'),
                okText: "Ok",
                cancelText: trans('button.cancel'),
                onOk: () => {
                    setListShow([])
                    setTimeout(() => {
                        setListShow(listEvents?.data)
                    }, 10);
                },
                cancelButtonProps: { style: { display: 'none' } }
            })
            return
        }

        const updateStatus = {id: eventId, is_start: checked}
        await changeStatus(updateStatus)
        setTimeout(() => {
            refetchStatus()
        }, 100);
        message.success(trans('campaign.success'))
    };

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
            title: trans('campaign.name_capaign'),
            className: "bold-400",
            dataIndex: "name",
            key: "name",
            disabled: false,
            width: 150,
            render: (name: any) => <div className="flex items-center">{name}</div>,
        },
        {
            title: trans('campaign.start_day'),
            className: "bold-400",
            dataIndex: "start_date",
            ellipsis: true,
            disabled: false,
            width: 150,
            render: (start_date: string) => (start_date ? formatDateFull(start_date) : <span className="text-gray-300">--</span>),
        },
        {
            title: trans('campaign.end_date'),
            dataIndex: "end_date",
            key: "end_date",
            align: "center",
            default: true,
            render: (end_date: string) => (end_date ? formatDateFull(end_date) : <span className="text-gray-300">--</span>),
            width: 150,
        },
        {
            title: trans('game.status'),
            dataIndex: "is_start",
            key: "is_start",
            align: "center",
            default: true,
            render: (is_start: boolean, event: any) => <>
                <Tooltip placement="top" title={is_start ? trans('campaign.running') : trans('campaign.dont_run')}>
                    <Switch onChange={(e) => onChangeStatus(e, event?.id)} defaultValue={is_start}/>
                </Tooltip>
            </>,
            width: 120,
        },
        {
            title: trans('game.action'),
            dataIndex: "id",
            key: "id",
            align: "center",
            default: true,
            render: (id:number, event:any ) => 
            <>
                <div className="flex justify-center">
                    <Tooltip title={trans('campaign.campaign_updates')}>
                        <Button
                            className="hover:!border-[#3498db] mr-2"
                            onClick={() => {
                                showModal(id)
                                setEventId(id)
                            }}
                            type="default"
                            icon={<i className="fa-regular fa-pen-to-square text-[#3498db]" />}
                        />
                    </Tooltip>
                    {!event?.is_start && <Tooltip title={trans('campaign.delete_campaign')}>
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
                    </Tooltip>}
                </div>
            </>,
            width: 120,
        },
    ]

    return (
        <DefaultLayout>
            <Card
                title={<Filter setOpen={showModal} setKeywork={setKeywork}/>}
                className="space-layout">
                <Table
                    rowKey={"id"}
                    columns={filter(columns, (iFil: any) => !iFil?.disabled)}
                    dataSource={listShow || []}
                    className="bd-radius-5"
                    loading={isLoading}
                    pagination={{
                        showSizeChanger: false,
                        current: pageCurren,
                        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
                        total: listEvents?.count || 0,
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
            {open && <CreateEvent openModal={open} eventId={eventId} setOpen={hideModal} resetData={resetData}/>}
            
        </DefaultLayout>
    )
}

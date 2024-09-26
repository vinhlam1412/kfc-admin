import { Row, Table } from "antd"
import React from "react"
import { IScore } from "@/domain/Score"
import { formatDateFull, formatDateMedium, numberFormatter } from "@/util/Common"
import { filter } from "lodash"

interface Props {
  listGame?: IScore[]
  gifts?: any
  histories?: any[]
  logs?: any[]
  logShare?: any[]
  bills: any[]
}

export const CardInfoGame: React.FC<Props> = ({listGame, gifts, histories, logs, bills}) => {

  const getNameScreen = (screen: string) => {
    let result = screen
    switch(screen) {
      case "form-screen":
        result = "Điền form"
        break;
      case "scan-screen":
        result = "Quét bill"
        break;
      case "list-game-screen":
        result = "Màn hình chọn game"
        break;
      case "game-screen":
        result = "Chơi game"
        break;
      case "rule-screen":
        result = "Luật chơi game"
        break;
      case "rule-detail-screen":
        result = "Chi tiết luật chơi game"
        break;
      case "download-screen":
        result = "Giới thiệu tải app KFC"
        break;
      case "gift-screen":
        result = "Nhận quà"
        break;
      default: result = screen
    } 
    return result;
  }

  const columns: any[] = [
  {
      title: "No",
      className: "bold-400",
      dataIndex: "no",
      key: "no",
      width: 60,
      render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
    },
    {
      title: "Voucher",
      className: "bold-400",
      dataIndex: "vouchers",
      key: "vouchers",
      ellipsis: true,
      width: 100,
      render: (record: any) => {
        return <>
          {record ? record?.name : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Ticket",
      className: "bold-400",
      dataIndex: "tickets",
      key: "tickets",
      ellipsis: true,
      width: 100,
      render: (record: any) => {
        return <>
          {record ? record?.name : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Reward",
      className: "bold-400",
      dataIndex: "rewards",
      key: "rewards",
      ellipsis: true,
      width: 200,
      render: (record: any) => {
        return <>
          {record ? record?.name : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Gift at",
      className: "bold-400",
      dataIndex: "gift_at",
      key: "gift_at",
      ellipsis: true,
      width: 120,
      render: (gift_at: string) => (gift_at ? formatDateFull(gift_at) : <span className="text-gray-300">--</span>)
    },
    {
      title: "Campaign",
      className: "bold-400",
      dataIndex: "events",
      key: "events",
      ellipsis: true,
      width: 200,
      render: (record: any) => {
        return <>
          {record ? record?.name: <span className="text-gray-300">--</span>}
        </>
      }
    },
  ]

  const columnScores: any[] = [
    {
      title: "No",
      className: "bold-400",
      dataIndex: "no",
      key: "no",
      width: 60,
      render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
    },
    {
      title: "Game",
      className: "bold-400",
      dataIndex: "games",
      key: "games",
      ellipsis: true,
      width: 100,
      render: (record: any) => {
        return <>
          {record ? record?.name : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Playing times",
      className: "bold-400",
      key: "playing",
      ellipsis: true,
      width: 100,
      render: (record: any) => (filter(histories, { event_id: record.event_id, game_id: record.game_id }).length),
    },
    {
      title: "Score",
      className: "bold-400",
      dataIndex: "score",
      key: "score",
      ellipsis: true,
      width: 100,
      render: (score: string) => (score ? numberFormatter(score) : <span className="text-gray-300">0</span>),
    },
    {
      title: "Campaign",
      className: "bold-400",
      dataIndex: "events",
      key: "events",
      ellipsis: true,
      width: 200,
      render: (record: any) => {
        return <>
          {record ? record?.name: <span className="text-gray-300">--</span>}
        </>
      }
    }
  ]

  const columnLogs: any[] = [
    {
      title: "No",
      className: "bold-400",
      dataIndex: "no",
      key: "no",
      width: 60,
      render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
    },
    {
      title: "Screen",
      className: "bold-400",
      dataIndex: "screen",
      key: "screen",
      ellipsis: true,
      width: 100,
      render: (screen: string) => {
        return <>
          {screen ? getNameScreen(screen) : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Game",
      className: "bold-400",
      dataIndex: "games",
      key: "games",
      ellipsis: true,
      width: 100,
      render: (record: any) => {
        return <>
          {record ? record?.name : <span className="text-gray-300">--</span>}
        </>
      }
    },
    {
      title: "Entry time",
      className: "bold-400",
      dataIndex: "entry_time",
      key: "entry_time",
      ellipsis: true,
      width: 100,
      render: (entry_time: any) => entry_time ? formatDateMedium(entry_time) : <span className="text-gray-300">--</span>,
    },
    {
      title: "Campaign",
      className: "bold-400",
      dataIndex: "events",
      key: "events",
      ellipsis: true,
      width: 200,
      render: (record: any) => {
        return <>
          {record ? record?.name: <span className="text-gray-300">--</span>}
        </>
      }
    }
  ]

  const columnBills: any [] = [
    {
      title: "No",
      className: "bold-400",
      dataIndex: "no",
      key: "no",
      width: 80,
      render: (_: any, record: any, index: number) => (record? index + 1 : <span className="text-gray-300">--</span>),
    },
    {
      title: "Invoices",
      className: "bold-400",
      dataIndex: "invoices",
      key: "invoices",
      ellipsis: true,
      width: 200
    },
    {
      title: "Order notes",
      className: "bold-400",
      dataIndex: "order_notes",
      key: "order_notes",
      ellipsis: true,
      width: 300
    },
  ]

  return (
    <Row gutter={[12, 12]}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={gifts || []}
        className="bd-radius-5 w-full"
        scroll={{
          x: true, y: "40vh"
        }}
        locale={{
          emptyText: "Data is empty",
        }}
        pagination={false}
      />
      <div className="mt-4">
        <Table
          rowKey="id"
          columns={columnScores}
          dataSource={listGame || []}
          className="bd-radius-5 w-full"
          scroll={{
            x: true, y: "40vh"
          }}
          locale={{
            emptyText: "Data is empty",
          }}
          pagination={false}
        />
      </div>
      <div className="mt-4">
        <Table
          rowKey="id"
          columns={columnLogs}
          dataSource={logs || []}
          className="bd-radius-5 w-full"
          scroll={{
            x: true, y: "40vh"
          }}
          locale={{
            emptyText: "Data is empty",
          }}
          pagination={false}
        />
      </div>
      <div className="mt-4">
        <Table
          rowKey="invoices"
          columns={columnBills}
          dataSource={bills || []}
          className="bd-radius-5 w-full"
          scroll={{
            x: true, y: "40vh"
          }}
          locale={{
            emptyText: "Data is empty",
          }}
          pagination={false}
        />
      </div>
    </Row>
  )
}

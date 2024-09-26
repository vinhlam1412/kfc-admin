import React, { useEffect, useLayoutEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import DefaultLayout from "@/component/Layout/Default"
import utc from "dayjs/plugin/utc"
import {
  useEventStart,
  useGamePlayHistory,
  useGameWithEvent,
  useHistoryReward,
  usePlayerGameHistory,
  usePlayerGameHistoryByDate,
  usePlayerWithGame,
  usePlayerWithGameByDate,
  useScoresByEvent,
  useTotalPlayer,
  useTrackingByEvent,
} from "@/hook/useDashboard"
import { Button, Card, Col, DatePicker, Row, Spin, Table, Tooltip } from "antd"
import { numberFormatter } from "@/util/Common"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  ChartOptions,
  LineElement,
  PointElement,
  LineController,
  BarController,
} from "chart.js"
import { Chart } from "react-chartjs-2"
import { trans } from "@/locale"
import type { GetProps } from "antd"
import { useLogsEvent } from "@/hook/useLogs"
import { get, isArray, sumBy, uniqBy } from "lodash"
import { dashboardCss } from "./style"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { useAppStore } from "@/store/useApp"
import * as FileSaver from "file-saver"
import * as XLSX from "xlsx"
dayjs.extend(utc)
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const { RangePicker } = DatePicker

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, ChartDataLabels, LineElement, PointElement, LineController, BarController)

const options: ChartOptions<any> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      text: "Number of players per game",
      display: false,
    },
    datalabels: {
      // color: "white",
      font: {
        size: window?.innerWidth >= 3000 ? 35 : 14,
        lineHeight: window?.innerWidth >= 3000 ? 40 : 18,
      },
      anchor: "end",
      align: "top",
      offset: window?.innerWidth >= 3000 ? -1240 : -120,
      formatter: (value: any) => {
        return value > 0 ? numberFormatter(value) : ""
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

export const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<any>(null)
  const { data: eventStart } = useEventStart()
  const [gameParam, setGameParam] = useState<any>({ startDate: null, endDate: null })
  const { data: scoresEvent } = useScoresByEvent(
    {
      event: eventStart?.data ? eventStart?.data[0]?.id : 0,
      ...gameParam,
    },
    eventStart?.data ? true : false,
  )
  const { data: trackingEvent, isLoading: isLoadingTracking } = useTrackingByEvent(
    {
      event: eventStart?.data ? eventStart?.data[0]?.id : 0,
      ...gameParam,
    },
    eventStart?.data ? true : false,
  )
  const { data: playerGame } = usePlayerWithGame(gameParam, eventStart?.data && gameParam?.startDate ? true : false)
  const { data: playerGameByDate } = usePlayerWithGameByDate(gameParam, eventStart?.data && gameParam?.startDate ? true : false)
  const { data: gameWithEvent } = useGameWithEvent(eventStart?.data ? eventStart?.data[0]?.game_id : [], eventStart?.data ? true : false)
  const { data: historyReward } = useHistoryReward(
    {
      event: eventStart?.data ? eventStart?.data[0]?.id : 0,
      ...gameParam,
    },
    eventStart?.data ? true : false,
  )
  const { data: logsEvent } = useLogsEvent(
    {
      event: eventStart?.data ? eventStart?.data[0]?.id : 0,
      ...gameParam,
    },
    eventStart?.data ? true : false,
  )
  const [dataChart, setDataChart] = useState<any>({
    labels: [],
    datasets: [],
  })
  const [totalTrafficPlay, setTotalTraficPlay] = useState(0)
  const [dataTable, setDataTable] = useState<any[]>([])
  const { data: players } = useTotalPlayer(gameParam)
  const { data: gamePlayHistory } = useGamePlayHistory(
    {
      event: eventStart?.data ? eventStart?.data[0]?.id : 0,
      ...gameParam,
    },
    eventStart?.data ? true : false,
  )
  const { data: trafficGame } = usePlayerGameHistory(gameParam, eventStart?.data && gameParam?.startDate ? true : false)
  const { data: trafficGameByDate } = usePlayerGameHistoryByDate(gameParam, eventStart?.data && gameParam?.startDate ? true : false)
  const changeLoading = useAppStore((state) => state.changeLoading)
  const exportLoading = useAppStore((state) => state.loading)

  useEffect(() => {
    document.title = "KFC Dashboard"
  }, [])

  useLayoutEffect(() => {
    if (isLoadingTracking || exportLoading) setLoading(true)
    else setLoading(false)
  }, [isLoadingTracking, exportLoading])

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    if (eventStart?.data && eventStart?.data[0]) {
      return current && (current < dayjs(eventStart?.data[0]?.start_date).startOf("D") || current > dayjs(eventStart?.data[0]?.end_date).startOf("D"))
    }
    return current && current > dayjs().endOf("day")
  }

  useEffect(() => {
    if (eventStart?.data) {
      setGameParam({
        startDate: dayjs(eventStart?.data[0]?.start_date).startOf("day").toISOString(),
        endDate: dayjs(eventStart?.data[0]?.end_date).endOf("day").toISOString(),
      })
    }
  }, [eventStart])

  useEffect(() => {
    if (date) setGameParam({ startDate: date[0].startOf("day").toISOString(), endDate: date[1].endOf("day").toISOString() })
    else if (eventStart?.data) {
      setGameParam({
        startDate: dayjs(eventStart?.data[0]?.start_date).startOf("day").toISOString(),
        endDate: dayjs(eventStart?.data[0]?.end_date).endOf("day").toISOString(),
      })
    }
    // eslint-disable-next-line
  }, [date])

  useEffect(() => {
    if (playerGame?.data && gameWithEvent?.data) {
      const labels: Array<string> = []
      const data: Array<number> = []
      const traffic: Array<number> = []
      let totalTraffic = 0
      gameWithEvent?.data.map((game) => {
        labels.push(game.name)
        const item = playerGame?.data.find((item: any) => item.game_id === game.id)
        if (item) {
          data.push(item.player_count)
        } else data.push(0)
        const itemTraffic = trafficGame?.data.find((item: any) => item.game_id === game.id)
        if (itemTraffic) {
          traffic.push(itemTraffic.player_count)
          totalTraffic += itemTraffic.player_count
        }
      })
      setDataChart({
        labels,
        datasets: [
          {
            type: "line" as const,
            label: "Player",
            data: data,
            borderColor: "rgb(190,18,60)",
            fill: false,
            datalabels: {
              color: "white",
            },
          },
          {
            type: "bar" as const,
            label: "Traffic",
            data: traffic,
            backgroundColor: "rgb(2,132,199)",
          },
        ],
      })
      setTotalTraficPlay(totalTraffic)
    }
  }, [playerGame, gameWithEvent, trafficGame])

  const totalScore = useMemo(() => {
    return scoresEvent?.data ? sumBy(scoresEvent?.data, "score") : 0
  }, [scoresEvent])

  const countVoucher = useMemo(() => {
    if (historyReward?.data) {
      const list = historyReward?.data.filter((item) => item.voucher_id !== null)
      return uniqBy(list, "player_id").length
    }
    return 0
  }, [historyReward])

  const countTrafficVoucher = useMemo(() => {
    if (historyReward?.data) {
      return historyReward?.data.filter((item) => item.voucher_id !== null).length
    }
    return 0
  }, [historyReward])

  const countTicket = useMemo(() => {
    if (historyReward?.data) {
      const list = historyReward?.data.filter((item) => item.ticket_id !== null)
      return uniqBy(list, "player_id").length
    }
    return 0
  }, [historyReward])

  const countTrafficTicket = useMemo(() => {
    if (historyReward?.data) {
      return historyReward?.data.filter((item) => item.ticket_id !== null).length
    }
    return 0
  }, [historyReward])

  const countReward = useMemo(() => {
    if (historyReward?.data) {
      const list = historyReward?.data.filter((item) => item.reward_id !== null)
      return uniqBy(list, "player_id").length
    }
    return 0
  }, [historyReward])

  const countScanScreen = useMemo(() => {
    return trackingEvent?.data ? trackingEvent?.data.filter((item) => item.screen === "scan-screen").length : 0
  }, [trackingEvent])

  const userScanScreen = useMemo(() => {
    const list = trackingEvent?.data ? trackingEvent?.data.filter((item) => item.screen === "scan-screen") : []
    return uniqBy(list, "player_id").length
  }, [trackingEvent])

  const userSuccessScanScreen = useMemo(() => {
    const list = logsEvent?.data ? logsEvent?.data.filter((item) => item.total_scan !== 0) : []
    return uniqBy(list, "player_id").length
  }, [logsEvent])

  const countListGameScreen = useMemo(() => {
    return trackingEvent?.data ? trackingEvent?.data.filter((item) => item.screen === "list-game-screen").length : 0
  }, [trackingEvent])

  const userListGameScreen = useMemo(() => {
    const list = trackingEvent?.data ? trackingEvent?.data.filter((item) => item.screen === "list-game-screen") : []
    return uniqBy(list, "player_id").length
  }, [trackingEvent])

  // const countGameScreen = useMemo(() => {
  //   return trackingEvent?.data ? trackingEvent?.data.filter(item => item.screen === "game-screen").length : 0
  // }, [trackingEvent])

  // const countGifScreen = useMemo(() => {
  //   return trackingEvent?.data ? trackingEvent?.data.filter(item => item.screen === "gift-screen").length : 0
  // }, [trackingEvent])

  const countRuleScreen = useMemo(() => {
    return trackingEvent?.data ? trackingEvent?.data.filter((item) => item.screen === "rule-screen").length : 0
  }, [trackingEvent])

  const onChangeDate = (dates: any) => {
    setDate(dates)
  }

  useEffect(() => {
    const data: any = []
    for (let index = 0; index < 3; index++) {
      data.push({
        key: index,
        tilte: index === 0 ? "Traffic" : index === 1 ? "Unique User" : "Drop Rate",
        formScreen: index === 0 ? players?.count : index === 1 ? players?.count : 0,
        scanScreen:
          index === 0 ? countScanScreen : index === 1 ? userScanScreen : players?.count ? `${((1 - userScanScreen / players?.count) * 100).toFixed(2)}%` : 0,
        listGameScreen:
          index === 0
            ? countListGameScreen
            : index === 1
              ? userListGameScreen
              : players?.count
                ? `${((1 - userListGameScreen / players?.count) * 100).toFixed(2)}%`
                : 0,
        gameScreen:
          index === 0
            ? gamePlayHistory?.count
            : index === 1
              ? gamePlayHistory?.data
                ? numberFormatter(uniqBy(gamePlayHistory?.data, "player_id").length)
                : 0
              : players?.count && gamePlayHistory?.data
                ? `${((1 - uniqBy(gamePlayHistory?.data, "player_id").length / players?.count) * 100).toFixed(2)}%`
                : 0,
        gifScreen:
          index === 0
            ? historyReward?.count
            : index === 1
              ? historyReward?.data
                ? numberFormatter(uniqBy(historyReward?.data, "player_id").length)
                : 0
              : historyReward?.data && players?.count
                ? `${((1 - uniqBy(historyReward?.data, "player_id").length / players?.count) * 100).toFixed(2)}%`
                : 0,
        ruleScreen: index === 0 ? countRuleScreen : index === 1 ? 0 : `${((1 - countRuleScreen / countScanScreen) * 100).toFixed(2)}%`,
        successScan:
          index === 0
            ? logsEvent?.data
              ? numberFormatter(sumBy(logsEvent?.data, "total_scan"))
              : 0
            : index === 1
              ? userSuccessScanScreen
              : players?.count
                ? `${((1 - userSuccessScanScreen / players?.count) * 100).toFixed(2)}%`
                : 0,
        share:
          index === 0
            ? logsEvent?.data
              ? sumBy(logsEvent?.data, "total_share")
              : 0
            : index === 1
              ? logsEvent?.data
                ? numberFormatter(logsEvent?.data.filter((item) => item.total_share !== 0).length)
                : 0
              : players?.count && logsEvent?.data
                ? `${((1 - logsEvent?.data.filter((item) => item.total_share !== 0).length / players?.count) * 100).toFixed(2)}%`
                : 0,
      })
    }
    setDataTable(data)
  }, [
    players,
    countScanScreen,
    countListGameScreen,
    historyReward,
    countRuleScreen,
    logsEvent,
    gamePlayHistory,
    userScanScreen,
    userListGameScreen,
    userSuccessScanScreen,
  ])

  const columns: any[] = [
    {
      title: "",
      className: "bold-400",
      dataIndex: "tilte",
      key: "tilte",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Signed-up",
      className: "bold-400",
      dataIndex: "formScreen",
      key: "formScreen",
      ellipsis: true,
      width: 150,
      render: (formScreen: number) => {
        return <>{formScreen ? numberFormatter(formScreen) : 0}</>
      },
    },
    {
      title: "Total Scan",
      className: "bold-400",
      dataIndex: "scanScreen",
      key: "scanScreen",
      ellipsis: true,
      width: 150,
      render: (scanScreen: number) => {
        return <>{scanScreen ? numberFormatter(scanScreen) : 0}</>
      },
    },
    {
      title: "Successful Scan",
      className: "bold-400",
      dataIndex: "successScan",
      key: "successScan",
      ellipsis: true,
      width: 150,
      render: (successScan: number) => (successScan ? numberFormatter(successScan) : 0),
    },
    {
      title: "Home games",
      className: "bold-400",
      dataIndex: "listGameScreen",
      key: "listGameScreen",
      ellipsis: true,
      width: 150,
      render: (listGameScreen: number) => {
        return <>{listGameScreen ? numberFormatter(listGameScreen) : 0}</>
      },
    },
    {
      title: "Game Play",
      className: "bold-400",
      dataIndex: "gameScreen",
      key: "gameScreen",
      ellipsis: true,
      width: 150,
      render: (gameScreen: number) => {
        return <>{gameScreen ? numberFormatter(gameScreen) : 0}</>
      },
    },
    // {
    //   title: "Luật chơi game",
    //   className: "bold-400",
    //   dataIndex: "ruleScreen",
    //   key: "ruleScreen",
    //   ellipsis: true,
    //   width: 150,
    //   render: (ruleScreen: number) => {
    //     return <>
    //       {ruleScreen ? numberFormatter(ruleScreen) : 0}
    //     </>
    //   }
    // },
    // {
    //   title: "Chơi thử",
    //   className: "bold-400",
    //   dataIndex: "playtest",
    //   key: "playtest",
    //   ellipsis: true,
    //   width: 150,
    //   render: (scanScreen: number) => {
    //     return <>
    //       {scanScreen ? numberFormatter(scanScreen) : 0}
    //     </>
    //   }
    // },
    // {
    //   title: "Chơi thật",
    //   className: "bold-400",
    //   dataIndex: "playgame",
    //   key: "playgame",
    //   ellipsis: true,
    //   width: 150,
    //   render: (scanScreen: number) => {
    //     return <>
    //       {scanScreen ? numberFormatter(scanScreen) : 0}
    //     </>
    //   }
    // },
    // {
    //   title: "Hàn thành game",
    //   className: "bold-400",
    //   dataIndex: "gamedone",
    //   key: "gamedone",
    //   ellipsis: true,
    //   width: 150,
    //   render: (scanScreen: number) => {
    //     return <>
    //       {scanScreen ? numberFormatter(scanScreen) : 0}
    //     </>
    //   }
    // },
    // {
    //   title: "Tham gia vòng quay",
    //   className: "bold-400",
    //   dataIndex: "spin",
    //   key: "spin",
    //   ellipsis: true,
    //   width: 150,
    //   render: (scanScreen: number) => {
    //     return <>
    //       {scanScreen ? numberFormatter(scanScreen) : 0}
    //     </>
    //   }
    // },
    // {
    //   title: "Hoàn thành vòng quay",
    //   className: "bold-400",
    //   dataIndex: "donespin",
    //   key: "donespin",
    //   ellipsis: true,
    //   width: 150,
    //   render: (scanScreen: number) => {
    //     return <>
    //       {scanScreen ? numberFormatter(scanScreen) : 0}
    //     </>
    //   }
    // },
    {
      title: (
        <p className="my-0">
          Total Rewards <br />
          <span className="font-light leading-[14px]">
            (KFC Voucher, CGV Ticket,
            <br /> Apple Watch, Airpods, Insax)
          </span>
        </p>
      ),
      className: "bold-400",
      dataIndex: "gifScreen",
      key: "gifScreen",
      ellipsis: true,
      width: 150,
      render: (gifScreen: number) => {
        return <>{gifScreen ? numberFormatter(gifScreen) : 0}</>
      },
    },
    {
      title: "Share",
      className: "bold-400",
      dataIndex: "share",
      key: "share",
      ellipsis: true,
      width: 150,
      render: (share: number) => {
        return <>{share ? numberFormatter(share) : 0}</>
      },
    },
  ]

  const fetchDataForDate = () => {
    return new Promise((resolve) => {
      const csvData = []
      let currentDate = dayjs(gameParam.startDate)
      let endDate = dayjs(gameParam.endDate)
      if (endDate.isAfter(dayjs())) {
        endDate = dayjs()
      }
      if (
        gameParam.startDate &&
        gameParam.endDate &&
        playerGameByDate?.data &&
        trafficGameByDate?.data &&
        players?.data &&
        trackingEvent?.data &&
        logsEvent?.data &&
        gamePlayHistory?.data &&
        historyReward?.data &&
        scoresEvent?.data
      ) {
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
          const dataPlayerGameByDate = playerGameByDate?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const dataTrafficGameByDate = trafficGameByDate?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const dataPlayers = players?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const trackingByDate = trackingEvent?.data.filter((item) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const uniqueUserTotalScan = trackingByDate.filter((item) => item.screen === "scan-screen")
          const logsByDate = logsEvent?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const gamePlayHistoryByDate = gamePlayHistory?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const uniqueUserGamePlay = uniqBy(gamePlayHistoryByDate, "player_id").length
          const scores = scoresEvent?.data.filter((item: any) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          const historyRewardByDate = historyReward?.data.filter((item) => dayjs(item.created_at).isSame(dayjs(currentDate), "day"))
          csvData.push({
            date: currentDate.format("DD-MM-YYYY"),
            trafficSignUser: dataPlayers.length,
            trafficTotalScan: uniqueUserTotalScan.length,
            trafficTotalScanSuccessfully: sumBy(logsByDate, "total_scan"),
            trafficHomeGames: trackingByDate.filter((item) => item.screen === "list-game-screen").length,
            trafficGamePlay: gamePlayHistoryByDate.length,
            totalKFCVouchers: historyRewardByDate.filter((item) => item.voucher_id !== null).length,
            totalKFCTicket: historyRewardByDate.filter((item) => item.ticket_id !== null).length,
            appleWatch: historyRewardByDate.filter((item) => item.reward_id === 1).length,
            airpods: historyRewardByDate.filter((item) => item.reward_id === 2).length,
            insax: historyRewardByDate.filter((item) => item.reward_id === 9).length,
            trafficShare: sumBy(logsByDate, "total_share"),
            gamePlayPerUser: uniqueUserGamePlay ? (gamePlayHistoryByDate.length / uniqueUserGamePlay).toFixed(2) : 0,
            scoreDistribution: scores.length ? sumBy(scores, "score") / scores.length : 0,
            trafficOAnQuan: get(
              dataTrafficGameByDate.find((item: any) => item.game_id === 1),
              "player_count",
            ),
            trafficBanhDua: get(
              dataTrafficGameByDate.find((item: any) => item.game_id === 2),
              "player_count",
            ),
            trafficNhayDay: get(
              dataTrafficGameByDate.find((item: any) => item.game_id === 3),
              "player_count",
            ),
            trafficNhayDoGang: get(
              dataTrafficGameByDate.find((item: any) => item.game_id === 4),
              "player_count",
            ),
            trafficThaDieu: get(
              dataTrafficGameByDate.find((item: any) => item.game_id === 5),
              "player_count",
            ),
            uniqueUserTotalScan: uniqBy(uniqueUserTotalScan, "player_id"),
            uniqueUserTotalScanSuccessfully: uniqBy(
              logsByDate.filter((item) => item.total_scan !== 0),
              "player_id",
            ).length,
            uniqueUserHomeGames: uniqBy(
              trackingByDate.filter((item) => item.screen === "list-game-screen"),
              "player_id",
            ).length,
            uniqueUserGamePlay: uniqueUserGamePlay,
            uniqueUserTotalRewards: uniqBy(historyRewardByDate, "player_id").length,
            uniqueUserShare: uniqBy(
              logsByDate.filter((item) => item.total_share !== 0),
              "player_id",
            ).length,
            uniqueUsersOAnQuan: get(
              dataPlayerGameByDate.find((item: any) => item.game_id === 1),
              "player_count",
            ),
            uniqueUsersBanhDua: get(
              dataPlayerGameByDate.find((item: any) => item.game_id === 2),
              "player_count",
            ),
            uniqueUsersNhayDay: get(
              dataPlayerGameByDate.find((item: any) => item.game_id === 3),
              "player_count",
            ),
            uniqueUsersNhayDoGang: get(
              dataPlayerGameByDate.find((item: any) => item.game_id === 4),
              "player_count",
            ),
            uniqueUsersThaDieu: get(
              dataPlayerGameByDate.find((item: any) => item.game_id === 5),
              "player_count",
            ),
          })
          currentDate = currentDate.add(1, "day")
        }
      }
      resolve(csvData)
    })
  }

  const handleExportCSV = () => {
    changeLoading(true)
    setTimeout(() => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      const fileExtension = ".xlsx"
      const heading = [
        "Date",
        "Traffic Sign-up user",
        "Traffic Total Scan",
        "Traffic Total scan successfully",
        "Traffic Home Games",
        "Traffic Game Play",
        "Total #KFC vouchers",
        "Total #KFC Ticket",
        "#Apple Watch",
        "#Airpods",
        "#Insax",
        "Traffic- Share",
        "Game Play Per User",
        "Score Distribution",
        "Traffic Ô Ăn Quan",
        "Traffic Banh Đũa",
        "Traffic Nhảy Dây",
        "Traffic Nhảy Đo Gang",
        "Traffic Thả Diều",
        "Unique User Total Scan",
        "Unique User Total scan successfully",
        "Unique User Home Games",
        "Unique User Game Play",
        "Unique User Total Rewards",
        "Unique User Share",
        "Number of unique users playing game Ô Ăn Quan",
        "Number of unique users playing game Banh Đũa",
        "Number of unique users playing game Nhảy Dây",
        "Number of unique users playing game Nhảy Đo Gang",
        "Number of unique users playing game Thả Diều",
      ]
      fetchDataForDate().then((res) => {
        let csvData: any[] = []
        if (isArray(res)) csvData = res
        const ws = XLSX.utils.json_to_sheet(csvData)
        const wb = XLSX.utils.book_new()

        XLSX.utils.sheet_add_aoa(ws, [heading], { origin: "A1" })
        const wscols = [
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 25 },
          { wch: 45 },
          { wch: 45 },
          { wch: 45 },
          { wch: 45 },
          { wch: 45 },
        ]
        ws["!cols"] = wscols
        XLSX.utils.book_append_sheet(wb, ws, "Daily report from dashboard")

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const dataExl = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(dataExl, "Daily report" + fileExtension)
        changeLoading(false)
      })
    }, 100)
  }

  return (
    <DefaultLayout loading={loading}>
      <Spin
        tip="Loading..."
        spinning={loading}>
        <div css={dashboardCss}>
          <div className="pb-4">
            <p className="my-0 text-[20px] font-medium">
              {trans("report.event_start")}: <strong>{eventStart?.data ? eventStart?.data[0]?.name : "N/A"}</strong>
            </p>
            <p className="my-0 text-sm text-gray-500">
              {trans("report.start_day")}: <strong>{eventStart?.data ? dayjs(eventStart?.data[0]?.start_date).format("DD-MM-YYYY") : "N/A"}</strong> -{" "}
              <strong>{eventStart?.data ? dayjs(eventStart?.data[0]?.end_date).format("DD-MM-YYYY") : "N/A"}</strong>
            </p>
            <div className="pt-4 md:flex justify-between">
              <div className="min-w-[250px]">
                <RangePicker
                  disabledDate={disabledDate}
                  onChange={onChangeDate}
                  value={date}
                  format="DD/MM/YYYY"
                  className="h-[40px]"
                />
              </div>
              <div>
                {gameParam.startDate &&
                gameParam.endDate &&
                playerGameByDate?.data &&
                trafficGameByDate?.data &&
                players?.data &&
                trackingEvent?.data &&
                logsEvent?.data &&
                gamePlayHistory?.data &&
                historyReward?.data &&
                scoresEvent?.data ? (
                  <Button
                    type="primary"
                    icon={<i className="fa-solid fa-file-excel"></i>}
                    className="min-w-[100px] text-[14px] h-[40px]"
                    onClick={handleExportCSV}
                    loading={exportLoading}>
                    Export Excel
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-4 list-box">
            {/* <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-blue-500 text-[45px]">
                  <i className="fa-solid fa-expand"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">Successful Scan</span>
                  <span className="block font-bold text-[30px]">{logsEvent?.data ? numberFormatter(sumBy(logsEvent?.data, "total_scan")) : 0}</span>
                </p>
              </div>
            </Card> */}
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-blue-500 text-[45px]">
                  <i className="fa-solid fa-users"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">Signed-up unique users</span>
                  <span className="block font-bold text-[30px]">{players?.count ? numberFormatter(players?.count) : 0}</span>
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-amber-500 text-[45px]">
                  <i className="fa-solid fa-gamepad"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">Game Play</span>
                  <span className="block font-bold text-[30px]">{gamePlayHistory?.count ? numberFormatter(gamePlayHistory?.count) : 0}</span>
                </p>
              </div>
            </Card>
            <Card>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-center h-full">
                  <span className="basis-[50px] shrink-0 text-orange-500 text-[45px]">
                    <i className="fa-solid fa-ticket-simple"></i>
                  </span>
                  <p className="my-0 grow pl-[15px] text-center">
                    <span className="block font-medium text-center">
                      Number of user get <br /> #KFC Voucher
                    </span>
                    <span className="block font-bold text-[30px]">{numberFormatter(countVoucher)}</span>
                  </p>
                </div>
                <p className="mb-0 mt-[10px]">Total #KFC vouchers: {numberFormatter(countTrafficVoucher)}</p>
              </div>
            </Card>
            <Card>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-center h-full">
                  <span className="basis-[50px] shrink-0 text-green-500 text-[45px]">
                    <i className="fa-solid fa-ticket"></i>
                  </span>
                  <p className="my-0 grow pl-[15px] text-center">
                    <span className="block font-medium text-center">
                      Number of user get <br />
                      #CGV Ticket
                    </span>
                    <span className="block font-bold text-[30px]">{numberFormatter(countTicket)}</span>
                  </p>
                </div>
                <p className="mb-0 mt-[10px]">Total #KFC Ticket: {numberFormatter(countTrafficTicket)}</p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-sky-500 text-[45px]">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <p className="my-0 grow pl-[15px]">
                  <span className="block font-medium">
                    #Apple Watch: {historyReward?.data ? historyReward?.data.filter((item) => item.reward_id === 1).length : 0}
                  </span>
                  <span className="block font-medium">
                    #Airpods: {historyReward?.data ? historyReward?.data.filter((item) => item.reward_id === 2).length : 0}
                  </span>
                  <span className="block font-medium">
                    #Insax: {historyReward?.data ? historyReward?.data.filter((item) => item.reward_id === 9).length : 0}
                  </span>
                  {/* <span className="block font-bold text-[30px]">{numberFormatter(countReward)}</span> */}
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-indigo-500 text-[45px]">
                  <i className="fa-solid fa-percent"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">
                    Conversion Rate
                    <Tooltip
                      className="ml-1"
                      placement="top"
                      title="Total users get all of kind of Reward/Total unique user">
                      <i className="fa-light fa-circle-exclamation"></i>
                    </Tooltip>
                  </span>
                  <span className="block font-bold text-[30px]">
                    {players?.count ? numberFormatter((((countVoucher + countReward + countTicket) / players?.count) * 100).toFixed(2)) : 0}%
                  </span>
                </p>
              </div>
            </Card>
            {/* <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-purple-500 text-[45px]">
                  <i className="fa-solid fa-share-nodes"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">Share</span>
                  <span className="block font-bold text-[30px]">{logsEvent?.data ? numberFormatter(sumBy(logsEvent?.data, "total_share")) : 0}</span>
                </p>
              </div>
            </Card> */}
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-yellow-500 text-[45px]">
                  <i className="fa-solid fa-gauge-simple"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">
                    Average per user scan a bill successfully
                    <Tooltip
                      className="ml-1"
                      placement="top"
                      title="Total traffic scan bill successfully/ Unique user scan">
                      <i className="fa-light fa-circle-exclamation"></i>
                    </Tooltip>
                  </span>
                  <span className="block font-bold text-[30px]">
                    {userSuccessScanScreen ? numberFormatter((sumBy(logsEvent?.data, "total_scan") / userSuccessScanScreen).toFixed(2)) : 0}
                  </span>
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-purple-500 text-[45px]">
                  <i className="fa-solid fa-percent"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">
                    Drop rate
                    <Tooltip
                      className="ml-1"
                      placement="top"
                      title="(signed up user - User scaned)/Signed up users">
                      <i className="fa-light fa-circle-exclamation"></i>
                    </Tooltip>
                  </span>
                  <span className="block font-bold text-[30px]">
                    {players?.count ? numberFormatter((((players?.count - userScanScreen) / players?.count) * 100).toFixed(2)) : 0}%
                  </span>
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-fuchsia-500 text-[45px]">
                  <i className="fa-solid fa-wave-square"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">
                    Game Play Per User
                    <Tooltip
                      className="ml-1"
                      placement="top"
                      title="Total playing game/ Total unique users">
                      <i className="fa-light fa-circle-exclamation"></i>
                    </Tooltip>
                  </span>
                  <span className="block font-bold text-[30px]">{players?.count ? numberFormatter((totalTrafficPlay / players?.count).toFixed(2)) : 0}</span>
                </p>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-center h-full">
                <span className="basis-[50px] shrink-0 text-pink-500 text-[45px]">
                  <i className="fa-solid fa-arrows-up-down-left-right"></i>
                </span>
                <p className="my-0 grow pl-[15px] text-center">
                  <span className="block font-medium text-center">
                    Score Distribution
                    <Tooltip
                      className="ml-1"
                      placement="top"
                      title="Total score/Total turns of playing game">
                      <i className="fa-light fa-circle-exclamation"></i>
                    </Tooltip>
                  </span>
                  <span className="block font-bold text-[30px]">{scoresEvent?.count ? numberFormatter((totalScore / scoresEvent?.count).toFixed(2)) : 0}</span>
                </p>
              </div>
            </Card>
          </div>
          <Row gutter={15}>
            <Col
              span={24}
              lg={12}>
              <Card className="h-[400px]">
                <p className="mt-0 text-[#e5002b] text-xl">
                  Number of people playing game:{" "}
                  <span className="font-bold text-2xl">{gamePlayHistory?.data ? numberFormatter(uniqBy(gamePlayHistory?.data, "player_id").length) : 0}</span>
                </p>
                <Chart
                  type="bar"
                  data={dataChart}
                  options={options}
                />
              </Card>
            </Col>
            <Col
              span={24}
              lg={12}>
              <Table
                rowKey="key"
                columns={columns}
                dataSource={dataTable}
                className="bd-radius-5 w-full"
                scroll={{
                  x: true,
                }}
                locale={{
                  emptyText: "Data is empty",
                }}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </Spin>
    </DefaultLayout>
  )
}

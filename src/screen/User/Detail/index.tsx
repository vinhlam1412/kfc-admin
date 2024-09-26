import React from "react"
import DefaultLayout from "@/component/Layout/Default"
import { Col, Row, Spin } from "antd"
import { UserInfo } from "./UserInfo"
import { CardInfoGame } from "./CardInfoGame"
import { useParams } from "react-router-dom"
import { useBillPlayerQuery, useDetailPlayerQuery, useGiftPlayerQuery, useHistoryPlayerQuery, useTrackingPlayerQuery } from "@/hook/usePlayers"
import { first, isEmpty } from "lodash"
import { useScoreByUserQuery } from "@/hook/useScore"
import { Notfound } from "@/component/Notfound"
import { useLogsPlayer } from "@/hook/useLogs"

export const DetailUser: React.FC = () => {
  const { id } = useParams()

  const { data: detailPlayer, isLoading: isLoadingDetail }: any = useDetailPlayerQuery(Number(id || ""), Boolean(id))
  const { data: scoreByUser, isLoading: isLoadingScore }: any = useScoreByUserQuery(Number(id || ""), Boolean(id))
  const { data: gifts }: any = useGiftPlayerQuery(Number(id || ""), Boolean(id))
  const {data: histories} = useHistoryPlayerQuery(Number(id || ""), Boolean(id))
  const {data: trackingPlayer} = useTrackingPlayerQuery(Number(id || ""), Boolean(id))
  const {data: logPlayer} = useLogsPlayer(Number(id || ""), Boolean(id))
  const {data: dataBill} = useBillPlayerQuery(Number(id || ""), Boolean(id))
  
  return (
    <DefaultLayout>
      {isLoadingDetail || isLoadingScore ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Spin />
        </div>
      ) : isEmpty(detailPlayer?.data) ? (
        <Notfound />
      ) : (
        <Row gutter={30}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            className="mb-4">
            <UserInfo detail={first(detailPlayer?.data)} logs={logPlayer?.data || []} />
          </Col>
          <Col
            sm={{ span: 24 }}
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 16 }}>
            <CardInfoGame listGame={scoreByUser?.data} gifts={gifts?.data} histories={histories?.data || []} logs={trackingPlayer?.data || []} logShare={logPlayer?.data || []} bills={dataBill?.data || []} />
          </Col>
        </Row>
      )}
    </DefaultLayout>
  )
}

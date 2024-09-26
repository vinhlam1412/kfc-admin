import { Card, Image } from "antd"
import React from "react"
import DefaultAvatarImg from "@assets/img/9.jpg"
import { IDetailPlayer } from "@/domain/DetailPlayer"
import { trans } from "@/locale"
import { formatDateShort, numberFormatter } from "@/util/Common"
import { sumBy } from "lodash"

interface Props {
  detail?: IDetailPlayer
  logs: any[]
}

export const UserInfo: React.FC<Props> = ({ detail, logs }) => {
  const getDivShowInfoUser = (key: string, data: string) => {
    return (
      <>
        <div className="flex">
          <p className="font-semibold">{key}: </p>
          <p className={`ml-1 ${data ? "" : "text-gray-300"}`}>{data ? data : "--"}</p>
        </div>
      </>
    )
  }

  return (
    <Card
      title={
        <div className="flex items-center py-4">
          <div className="shrink-0 pr-2">
          <Image
            className="rounded-[50%]"
            src={detail?.avatar ? detail?.avatar : DefaultAvatarImg}
            width={60}
          />
          </div>
          <div className="flex-1">
            <p className="my-2 text-left text-[#8c9097] break-words">{detail?.name || "--"}</p>
            <p className="my-2 text-left font-semibold break-words">{detail?.phone || "--"}</p>
          </div>
        </div>
      }>
      <div className="grid">
        {getDivShowInfoUser(trans("player.name"), detail?.alternative_name || "")}
        {getDivShowInfoUser(trans("player.phone"), detail?.alternative_phone || "")}
        {getDivShowInfoUser(trans("player.birthday"), formatDateShort(detail?.created_at || ""))}
        {/* {getDivShowInfoUser("Email", detail?.email || "")}
        {getDivShowInfoUser("Following OA", detail?.is_following_oa ? "Yes" : "No")} */}
        {getDivShowInfoUser("Total scan", numberFormatter(sumBy(logs, "total_scan")))}
        {getDivShowInfoUser("Total share", numberFormatter(sumBy(logs, "total_share")))}
      </div>
    </Card>
  )
}

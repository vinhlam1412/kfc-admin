import React from "react"
import RewardConfig from "./RewardConfig"

interface Props {
  data?: any
  isLoading?: boolean
  config?: any
  event?: any
}

export const WeeklyReward: React.FC<Props> = (props: Props) => {

  return (
    <div className="relative">
      <RewardConfig 
        data={props?.data || []}
        isLoading={props?.isLoading}
        config={props?.config}
        event={props?.event}
        />
    </div>
  )
}

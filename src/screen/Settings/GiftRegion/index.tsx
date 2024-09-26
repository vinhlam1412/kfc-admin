import React from "react"
import GiftConfig from "./GiftConfig"

interface Props {
  data?: any
  config?: any
  event?: any
  isLoading?: boolean
}

export const GiftRegion: React.FC<Props> = (props: Props) => {

  return (
    <div className="relative">
      <GiftConfig
        data={props?.data || []}
        isLoading={props?.isLoading}
        config={props?.config}
        event={props?.event}
      />
    </div>
  )
}

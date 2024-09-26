import React from "react"
import { Result } from "antd"
import { trans } from "@/locale"

export const Notfound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle={trans("error.error404")}
    />
  )
}

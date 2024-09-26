import React, { useEffect } from "react"

import { Result } from "antd"
import { trans } from "@/locale"

export const AccessDenied = () => {
  useEffect(() => {
    document.title = '403'
  }, [])

  return (
    <Result
      status="403"
      title="403"
      subTitle={trans("login.notPermission")}
    />
  )
}

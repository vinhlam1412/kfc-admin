import React from "react"
import { Navigate } from "react-router-dom"
import { every, isEmpty } from "lodash"
import { SecurityService } from "@util/SecurityService"
import { AccessDenied } from "@component/AccessDenied"
import DefaultLayout from "@component/Layout/Default"

interface Props {
  children?: any
  permissions?: string[]
}

export const AuthenticateRoute = (props: Props) => {
  if (!SecurityService.isLogged()) {
    return <Navigate to={"/login"} />
  }

  let component = props.children

  if (!isEmpty(props.permissions) && every(props.permissions, (item) => !SecurityService.can(item))) {
    component = (
      <DefaultLayout loading={false}>
        <AccessDenied />
      </DefaultLayout>
    )
  }

  return component
}

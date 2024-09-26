import React, { ReactElement } from "react"
import { Dashboard } from "@screen/Dashboard"
import { Login } from "@screen/Login"
import { AuthenticateRoute } from "@component/AuthenticateRoute"
import { AccessDenied } from "@component/AccessDenied"
import { User } from "@/screen/User"
import { DetailUser } from "@/screen/User/Detail"
import { ManageLogin } from "@/screen/ManageLogin"
import { Games } from "@/screen/Games"
import { Gifts } from "@/screen/Gifts"
import { ManageShop } from "@/screen/ManageShop"
import { Events } from "@/screen/Events"
import { Settings } from "@/screen/Settings"

export interface IRouteConfig {
  name: string
  path: string
  component: ReactElement
}

export const routes: Array<IRouteConfig> = [
  {
    name: "dashboard",
    path: "/",
    component: (
      <AuthenticateRoute>
        <Dashboard />
      </AuthenticateRoute>
    ),
  },
  {
    name: "login",
    path: "/login",
    component: <Login />,
  },
  {
    name: "403",
    path: "/403",
    component: <AccessDenied />,
  },
  {
    name: "users",
    path: "/users",
    component: (
      <AuthenticateRoute>
        <User />
      </AuthenticateRoute>
    ),
  },
  {
    name: "users",
    path: "/users/:id",
    component: (
      <AuthenticateRoute>
        <DetailUser />
      </AuthenticateRoute>
    ),
  },
  {
    name: "admins",
    path: "/admins",
    component: (
      <AuthenticateRoute>
        <ManageLogin />
      </AuthenticateRoute>
    ),
  },
  {
    name: "events",
    path: "/events",
    component: (
      <AuthenticateRoute>
        <Events />
      </AuthenticateRoute>
    ),
  },
  {
    name: "games",
    path: "/games",
    component: (
      <AuthenticateRoute>
        <Games />
      </AuthenticateRoute>
    ),
  },
  {
    name: "gifts",
    path: "/gifts",
    component: (
      <AuthenticateRoute>
        <Gifts />
      </AuthenticateRoute>
    ),
  },
  {
    name: "shop",
    path: "/shop",
    component: (
      <AuthenticateRoute>
        <ManageShop />
      </AuthenticateRoute>
    ),
  },
  {
    name: "settings",
    path: "/settings",
    component: (
      <AuthenticateRoute>
        <Settings />
      </AuthenticateRoute>
    ),
  },
]

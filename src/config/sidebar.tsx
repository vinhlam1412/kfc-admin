import { trans } from "@/locale"
import React, { ReactElement } from "react"

export interface IMenuItem {
  key: string
  label: string
  icon: ReactElement
  url: string
  show: boolean
  children?: Array<IMenuItem>
}

export const menuItems: IMenuItem[] = [
  {
    key: "dashboard",
    label: trans("sidebar.report"),
    icon: <i className="fa-solid fa-gauge"></i>,
    url: "/",
    show: true,
  },
  {
    key: "users",
    label: trans("sidebar.players"),
    icon: <i className="fa-solid fa-users"></i>,
    url: "/users",
    show: true,
  },
  {
    key: "shop",
    label: trans("sidebar.stores"),
    icon: <i className="fa-solid fa-store"></i>,
    url: "/shop",
    show: true,
  },
  {
    key: "events",
    label: trans("sidebar.campaigns"),
    icon: <i className="fa-solid fa-clock"></i>,
    url: "/events",
    show: true,
  },
  {
    key: "games",
    label: trans("sidebar.games"),
    icon: <i className="fa-solid fa-gamepad"></i>,
    url: "/games",
    show: true,
  },
  // {
  //   key: "ranking",
  //   label: 'Bảng xếp hạng',
  //   icon: <i className="fa-solid fa-chart-simple"></i>,
  //   url: "/ranking",
  //   show: true,
  // },
  {
    key: "gifts",
    label: trans("sidebar.gifts"),
    icon: <i className="fa-solid fa-gift"></i>,
    url: "/gifts",
    show: true,
  },
  {
    key: "settings",
    label: trans("sidebar.settings"),
    icon: <i className="fa-solid fa-gear" />,
    url: "/",
    show: true,
    children: [
      {
        key: "settingEvent",
        label: trans("sidebar.setting_event"),
        icon: <i className="fa-solid fa-puzzle-piece"></i>,
        url: "/settings",
        show: true,
      },
      {
        key: "admins",
        label: trans("sidebar.admins"),
        icon: <i className="fa-solid fa-user-tie" />,
        url: "/admins",
        show: true,
      },
    ]
  },
]

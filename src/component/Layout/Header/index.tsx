import React, { useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { SecurityService } from "@util/SecurityService"
import { headerCss } from "@component/Layout/Header/style"
import { Avatar, Button, Menu, Popover, Typography } from "antd"
import lodash from "lodash"
import DefaultAvatarImg from "@assets/img/9.jpg"
import { IUser } from "@/domain/User"
import { trans } from "@/locale"
import { useNavigate } from "react-router-dom"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import supabase from "@/util/SupabaseClient"
import { localStore } from "@/util/LocalStore"
dayjs.extend(utc)
dayjs.extend(timezone)

interface IProps {
  collapsed: boolean
  onCollapsed: (val: boolean) => void
}

const Header: React.FC<IProps> = (props) => {
  const userInfo = SecurityService.getUser()
  const { collapsed, onCollapsed } = props
  const [user] = useState<IUser>(SecurityService.getUser())
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStore.removeItem("supabaseSession")
    localStore.removeItem("supabaseUser")
    navigate("/login")
  }

  const renderDropDownUser = () => {
    return (
      <Menu
        className="header-dropdown w-[150px] -m-[12px]"
        items={[
          {
            label: trans("login.logout_btn"),
            key: "3",
            icon: <i className="fa-light fa-right-from-bracket"></i>,
            onClick: handleLogout
          },
        ]}
      />
    )
  }

  return (
    <div
      css={headerCss}
      className={`bg-white flex items-center py-2 px-6`}>
      <Button
        className="bg-white border-none text-[rgb(35,35,35)] h-[35px] text-left !outline-none inline-flex items-center btn-toogle"
        icon={
          collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        }
        onClick={() => {
          onCollapsed(!collapsed)
        }}></Button>
      <div className="grow flex justify-end items-center gap-x-6">
        <Popover
          placement="bottom"
          trigger="click"
          content={renderDropDownUser()}>
          <Avatar
            shape="circle"
            size={32}
            src={lodash.get(user, "avatar") ? lodash.get(user, "avatar")?.toString() : DefaultAvatarImg}
          />
          <Typography.Text
            strong
            className="ml-1">
            {userInfo?.name}
          </Typography.Text>
        </Popover>
      </div>
    </div>
  )
}

export default Header

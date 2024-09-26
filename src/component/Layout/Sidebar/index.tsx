import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Image, Layout, Menu } from "antd"
import { menuItems } from "@config/sidebar"
import { useCurrentRoute } from "@hook/useCurrentRoute"
import { omit } from "lodash"
import { slidebarCss } from "@component/Layout/Sidebar/style"
const { Sider } = Layout

interface Props {
  collapsed: boolean
  onCollapsed: (val: boolean) => void
}

const SideBar: React.FC<Props> = ({ collapsed, onCollapsed }) => {
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const isOpenSidebar = !collapsed

  const filteredMenuItems = menuItems
    .filter((menuItem) => menuItem?.show)
    .map((menuItem) => {
      const filteredChild = menuItem?.children?.filter((item) => item?.show).map((item) => omit(item, "show"))
      const returnMenuItem = omit(menuItem, "show")
      return { ...returnMenuItem, children: filteredChild }
    })

  useEffect(() => {
    if (currentRoute) {
      let exitItem = filteredMenuItems.find(el => el.key === currentRoute.name)
      if (exitItem) setSelectedKeys([currentRoute.name]) 
      else {
        exitItem = filteredMenuItems.find(el => el.children?.find(menu => menu.key === currentRoute.name))
        if (exitItem) setSelectedKeys([currentRoute.name])
        else {
          const path = currentRoute.path.split("/")
          exitItem = filteredMenuItems.find(el => el.children?.find(menu => menu.url === `/${path[1]}`))
          if (exitItem && exitItem?.children) {
            const itemMenu: any = exitItem?.children.find(menu => menu.url === `/${path[1]}`)
            setSelectedKeys([itemMenu?.key])
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [currentRoute])

  const handleSelectMenuItem = (itemSelect: any) => {
    navigate(itemSelect?.item?.props?.url)
    setSelectedKeys(itemSelect?.selectedKeys)
  }

  const handleOpenChange = (openKeys: string[]) => {
    if (!isOpenSidebar && openKeys.length === 1)
      onCollapsed(false)
  }

  return (
    <>
      <Sider
        collapsed={!isOpenSidebar}
        onCollapse={onCollapsed}
        collapsedWidth={80}
        width={230}
        css={slidebarCss}
        className={`overflow-y-auto !bg-white border-r-[#f3f3f3] border-[1px] border-solid border-y-0 border-l-0`}
        trigger={null}>
        <div className="relative h-screen">
          <div className={`border-solid border-[1px] border-t-0 border-x-0 border-b-[#f3f3f3] mb-4 ${isOpenSidebar ? 'px-8 py-6' : 'py-4 px-2'}`}>
            <Link to="/" className="flex justify-center items-center">
              <Image src="/kfc-logo.svg" alt="logo" preview={false} className={`max-h-[60px] ${isOpenSidebar ? 'max-w-[100px]' : ''}`} />
            </Link>
          </div>
          <Menu
            className="!bg-transparent text-white"
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={handleSelectMenuItem}
            items={filteredMenuItems}
            onOpenChange={handleOpenChange}
          />
        </div>
      </Sider>
    </>
  )
}

export default SideBar

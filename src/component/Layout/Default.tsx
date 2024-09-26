import React, { PropsWithChildren, useEffect, useState } from "react"
import { App, Layout } from "antd"
// import { trans } from "@/locale"
import { usePageTitleStore } from "@store/usePageTitle"
import Header from "./Header"
import SideBar from "./Sidebar"
import { Footer } from "antd/es/layout/layout"
import { localStore } from "@/util/LocalStore"

const { Content } = Layout

interface Props extends PropsWithChildren<any> {
  loading?: boolean
  toLink?: string
}

const DefaultLayout = (props: Props) => {
  const [collapsed, setCollapsed] = useState(localStore.getItem("collapsed") ? localStore.getItem("collapsed") === 'true' : true)
  const title = usePageTitleStore((state) => state.title)

  useEffect(() => {
    document.title = title
    handlePageLoad()
  }, [title])

  const onCollapsed = (collapsed: boolean) => {
    setCollapsed(collapsed)
    localStore.setItem("collapsed", String(collapsed))
  }

  useEffect(() => {
    window.addEventListener('load', handlePageLoad);
  }, [collapsed])

  const handlePageLoad = () => {
    const collapStore = localStore.getItem("collapsed") ? localStore.getItem("collapsed") === 'true' : true;
    setCollapsed(collapStore)
  }

  return (
    <App>
      <Layout className="overflow-x-hidden">
        <SideBar
          collapsed={collapsed}
          onCollapsed={onCollapsed}
        />
        <Layout className={`relative bg-[rgb(240,241,247)] ${props.loading ? "h-screen" : "min-h-[100vh]"}`}>
          {/* <Spin
            tip={trans("message.loading")}
            // spinning={props.loading}
            > */}
            <Layout className="bg-[rgb(240,241,247)] min-h-[100vh]">
              <Header
                collapsed={collapsed}
                onCollapsed={onCollapsed}
              />
              <Content className="p-6">{props.children}</Content>
              <Footer className="bg-white text-center py-4">
                Copyright © 2024
              </Footer>
            </Layout>
          {/* </Spin> */}
        </Layout>
      </Layout>
    </App>
  )
}

export default DefaultLayout

import React from "react"
import DefaultLayout from "@/component/Layout/Default"
import List from "./List"
import { Card } from "antd"
// import { useUserStore } from "@/store/useUser"
import { AddAccount } from "./AddAccount"
import { useUserQuery } from "@/hook/useUser"
import { UpdateAccount } from "./UpdateAccount"
// import { trans } from "@/locale"

export const ManageLogin: React.FC = () => {
  // const { changeVisibleAddAccount } = useUserStore()

  const { data: userList } = useUserQuery()

  // const handleShowModal = () => {
  //   changeVisibleAddAccount(true)
  // }

  return (
    <DefaultLayout>
      <Card
        // extra={
        //   <Row>
        //     <Col>
        //       <Button
        //         type="primary"
        //         onClick={handleShowModal}
        //         icon={<i className="fa-solid fa-plus mr-2" />}>
        //         {trans("admin.add_account")}
        //       </Button>
        //       </Col>
        //   </Row>
        // }
        className="space-layout">
        <List data={userList?.data?.users || []} />
      </Card>
      <AddAccount />
      <UpdateAccount />
    </DefaultLayout>
  )
}

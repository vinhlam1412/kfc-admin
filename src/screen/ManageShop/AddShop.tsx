import React from "react"
import { Button, Form, Input, InputNumber, Modal, Space, Spin, message } from "antd"
import { useShopStore } from "@/store/useShop"
import { useCreateStore } from "@/hook/useStore"
import LoadingMore from "@component/LoadingMore"
import { SelectArea } from "@/component/SelectArea/container"
import { trans } from "@/locale"

export const AddShop: React.FC = () => {
  const [formRef] = Form.useForm()
  const { visible, changeVisible } = useShopStore()

  const createStore = useCreateStore()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: createStore.isPending, numberSetTimeOut: 1000 })

  const onAddShop = (values: any) => {
    const dataRequest = {
      address: values?.address || "",
      area: values?.area || "",
      name: values?.name || "",
      code: values?.code || "",
      store_id: Number(values?.store_id),
    }

    setCountMore((old: number) => old + 1)
    createStore.mutateAsync({ ...dataRequest }).then((result: any) => {
      if (result?.status === 201) {
        message.success(trans("message.success"))
        formRef.resetFields()
        changeVisible(false)
      } else {
        message.error(result?.error?.message || trans("message.fail"))
      }
    })
  }

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={trans("store.add")}
      open={visible}
      footer={null}
      width={620}
      onCancel={() => {
        changeVisible(false)
        formRef.resetFields()
      }}>
      {createStore?.isPending ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Form
          form={formRef}
          onFinish={onAddShop}
          layout="vertical">
          <Form.Item
            name="name"
            label={<span className="font-medium">{trans("store.name")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("store.name")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  name: e.target.value.trim(),
                })
                formRef.validateFields(["name"])
              }}
            />
          </Form.Item>
          <Form.Item
            name="code"
            label={<span className="font-medium">{trans("store.id")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("store.id")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  code: e.target.value.trim(),
                })
                formRef.validateFields(["code"])
              }}
            />
          </Form.Item>
          <Form.Item
            name="store_id"
            label={<span className="font-medium">{trans("store.number_id")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={1}
              controls={false}
              maxLength={11}
              placeholder={trans("store.number_id")}
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label={<span className="font-medium">{trans("store.address")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("store.address")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  address: e.target.value.trim(),
                })
                formRef.validateFields(["address"])
              }}
            />
          </Form.Item>
          <Form.Item
            name="area"
            label={<span className="font-medium">{trans("setting.area")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <SelectArea refetchOnMount={false} />
          </Form.Item>
          <Space className="flex justify-end">
            <Button
              htmlType="button"
              loading={isLoadingMore}
              onClick={() => {
                changeVisible(false)
                formRef.resetFields()
              }}>
            {trans("button.cancel")}
            </Button>
            <Button
              loading={isLoadingMore}
              type="primary"
              htmlType="submit">
            {trans("button.save")}
            </Button>
          </Space>
        </Form>
      )}
    </Modal>
  )
}

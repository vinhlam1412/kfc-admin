import { Button, Form, Input, Modal, Space, message } from "antd"
import React from "react"
import { useUserStore } from "@store/useUser"
import LoadingMore from "@/component/LoadingMore"
import { useCreateUser } from "@/hook/useUser"
import { isEmpty } from "lodash"
import { trans } from "@/locale"
export const AddAccount: React.FC = () => {
  const [formRef] = Form.useForm()
  const { visibleAddAccount, changeVisibleAddAccount } = useUserStore()

  const createUser = useCreateUser()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: createUser.isPending, numberSetTimeOut: 1000 })

  const onAddAccount = (values: any) => {
    const dataRequest = {
      email: values?.email || "",
      password: values?.password || "",
    }

    setCountMore((old: number) => old + 1)
    createUser.mutateAsync({ ...dataRequest }).then((result: any) => {
      if (isEmpty(result?.error)) {
        message.success(trans("message.success"))
        formRef.resetFields()
        changeVisibleAddAccount(false)
      } else {
        message.error(result?.error?.message || trans("message.fail"))
      }
    })
  }

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={trans("admin.add_account")}
      open={visibleAddAccount}
      footer={null}
      width={620}
      onCancel={() => {
        changeVisibleAddAccount(false)
        formRef.resetFields()
      }}>
      <Form
        form={formRef}
        onFinish={onAddAccount}
        layout="vertical">
        <Form.Item
          name="email"
          label={<span className="font-medium">{"Email"}</span>}
          rules={[
            { required: true, message: trans("message.required") },
            {
              type: "email",
              message: trans("validate.email"),
            },
          ]}>
          <Input
            placeholder={"Email"}
            onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            onBlur={(e) => {
              formRef.setFieldsValue({
                email: e.target.value.trim(),
              })
              formRef.validateFields(["email"])
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={<span className="font-medium">{trans("admin.password")}</span>}
          rules={[{ required: true, message: trans("message.required") }]}>
          <Input.Password
            placeholder={trans("admin.password")}
            onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            onBlur={(e) => {
              formRef.setFieldsValue({
                password: e.target.value.trim(),
              })
              formRef.validateFields(["password"])
            }}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(pre, next) => pre.password !== next.password}>
          <Form.Item
            name="confirmPassword"
            label={trans("admin.confirm_password")}
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: trans("message.required") },
              ({ getFieldValue }) => {
                return {
                validator(_, value) {
                  if (!getFieldValue("password") && !value) {
                    return Promise.resolve()
                  }
                  if (getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(trans("validate.confirm_password")))
                },
              }},
            ]}>
            <Input.Password
              placeholder={trans("admin.confirm_password")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  confirmPassword: e.target.value.trim(),
                })
                formRef.validateFields(["confirmPassword"])
              }}
            />
          </Form.Item>
        </Form.Item>
        <Space className="flex justify-end">
          <Button
            htmlType="button"
            loading={isLoadingMore}
            onClick={() => {
              changeVisibleAddAccount(false)
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
    </Modal>
  )
}

import React, { useState } from "react"
import { Button, Form, Input, Modal, Space, Spin, message } from "antd"
import { useCreateTicket } from "@/hook/useTicket"
import LoadingMore from "@component/LoadingMore"
import { useGiftStore } from "@/store/usGift"
import { ITicketRequest } from "@/domain/Gift"
import { trans } from "@/locale"
import { SelectEvent } from "@/component/SelectEvent"

export const AddTicket: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const { visibleAddTicket, changeVisibleAddTicket } = useGiftStore()

  const createTicket = useCreateTicket()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || createTicket.isPending, numberSetTimeOut: 1000 })

  const onAddVoucher = (values: any) => {
    const dataRequest: ITicketRequest = {
      event_id: values?.event_id,
      name: values?.name || "",
      serial_no: values?.serial_no || "",
      pin_no: values?.pin_no || "",
    }

    setCountMore((old: number) => old + 1)
    setIsClick(true)

    setTimeout(() => {
      setIsClick(false)
    }, 1000)

    createTicket.mutateAsync(dataRequest).then((result: any) => {
      if (result?.status === 201) {
        message.success(trans("message.success"))
        formRef.resetFields()
        changeVisibleAddTicket(false)
      } else {
        message.error(result?.error?.message || trans("message.fail"))
      }
    })
  }

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={trans("gift.add_ticket")}
      open={visibleAddTicket}
      footer={null}
      width={520}
      onCancel={() => {
        changeVisibleAddTicket(false)
        formRef.resetFields()
      }}>
      {createTicket?.isPending ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Form
          form={formRef}
          onFinish={onAddVoucher}
          layout="vertical">
          <Form.Item
            name="event_id"
            label={<span className="font-medium">{trans("gift.event")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <SelectEvent refetchOnMount={false} />
          </Form.Item>
          <Form.Item
            name="name"
            label={<span className="font-medium">{trans("gift_ticket.name")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("gift_ticket.name")}
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
            name="serial_no"
            label={<span className="font-medium">{trans("gift_ticket.serial_no")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("gift_ticket.serial_no")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  serial_no: e.target.value.trim(),
                })
                formRef.validateFields(["serial_no"])
              }}
            />
          </Form.Item>
          <Form.Item
            name="pin_no"
            label={<span className="font-medium">{trans("gift_ticket.pin_no")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("gift_ticket.pin_no")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  pin_no: e.target.value.trim(),
                })
                formRef.validateFields(["pin_no"])
              }}
            />
          </Form.Item>
          <Space className="flex justify-end">
            <Button
              htmlType="button"
              loading={isLoadingMore}
              onClick={() => {
                changeVisibleAddTicket(false)
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

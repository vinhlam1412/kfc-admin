import React, { useState } from "react"
import { Button, DatePicker, Form, Input, Modal, Space, Spin, message } from "antd"
import { useCreateVoucher } from "@/hook/useGift"
import LoadingMore from "@component/LoadingMore"
import { useGiftStore } from "@/store/usGift"
import dayjs from "dayjs"
import { IVoucherRequest } from "@/domain/Gift"
import { trans } from "@/locale"
import { SelectEvent } from "@/component/SelectEvent"

export const AddVoucher: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const { visibleAddVoucher, changeVisibleAddVoucher } = useGiftStore()

  const createVoucher = useCreateVoucher()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || createVoucher.isPending, numberSetTimeOut: 1000 })

  const onAddVoucher = (values: any) => {
    const dataRequest: IVoucherRequest = {
      code: values?.code || "",
      started_at: values?.started_at ? dayjs(values?.started_at).toISOString() : "",
      ended_at: values?.ended_at ? dayjs(values?.ended_at).toISOString() : "",
      event_id: values?.event_id
    }

    setCountMore((old: number) => old + 1)

    const startDate = dayjs(values?.started_at)
    const endDate = dayjs(values?.ended_at)
    if (startDate.isAfter(endDate)) {
      message.error(trans("gift.start_date_less_equal_end_date"))
      setIsClick(true)

      setTimeout(() => {
        setIsClick(false)
      }, 1000)
    } else {
      createVoucher.mutateAsync(dataRequest).then((result: any) => {
        if (result?.status === 201) {
          message.success(trans("message.success"))
          formRef.resetFields()
          changeVisibleAddVoucher(false)
        } else {
          message.error(result?.error?.message || trans("message.fail"))
        }
      })
    }
  }

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={trans("gift.add_voucher")}
      open={visibleAddVoucher}
      footer={null}
      width={520}
      onCancel={() => {
        changeVisibleAddVoucher(false)
        formRef.resetFields()
      }}>
      {createVoucher?.isPending ? (
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
            name="code"
            label={<span className="font-medium">{trans("gift.voucher")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("gift.voucher")}
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
            name="started_at"
            label={trans("campaign.start_day")}>
            <DatePicker
              className="w-full"
              placeholder={trans("campaign.start_day")}
              format="DD/MM/YYYY"
              showTime={false}
              allowClear={false}
              disabledDate={(current) => current < dayjs().startOf("day")}
            />
          </Form.Item>
          <Form.Item
            name="ended_at"
            label={trans("campaign.end_date")}>
            <DatePicker
              className="w-full"
              placeholder={trans("campaign.end_date")}
              format="DD/MM/YYYY"
              showTime={false}
              allowClear={false}
              disabledDate={(current) => current < dayjs().startOf("day")}
            />
          </Form.Item>
          <Space className="flex justify-end">
            <Button
              htmlType="button"
              loading={isLoadingMore}
              onClick={() => {
                changeVisibleAddVoucher(false)
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

import React, { useState } from "react"
import { Button, DatePicker, Form, Input, InputNumber, Modal, Space, Spin, message } from "antd"
import { useCreateReward } from "@/hook/useReward"
import LoadingMore from "@component/LoadingMore"
import { useGiftStore } from "@/store/usGift"
import { ICreateRewardRequest } from "@/domain/Gift"
import { trans } from "@/locale"
import { SelectEvent } from "@/component/SelectEvent"
import dayjs from "dayjs"

export const AddReward: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const { visibleAddReward, changeVisibleAddReward } = useGiftStore()

  const createReward = useCreateReward()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || createReward.isPending, numberSetTimeOut: 1000 })
  const onAddVoucher = (values: any) => {
    const dataRequest: ICreateRewardRequest = {
      name: values?.name || "",
      image: values?.imageLink || "",
      quantity: Number(values?.quantity),
      started_at: values?.started_at ? dayjs(values?.started_at).toISOString() : "",
      ended_at: values?.ended_at ? dayjs(values?.ended_at).toISOString() : "",
      event_id: values?.event_id || "",
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
      createReward.mutateAsync(dataRequest).then((result: any) => {
        if (result?.status === 201) {
          message.success(trans("message.success"))
          formRef.resetFields()
          changeVisibleAddReward(false)
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
      title={trans("reward.add_gift")}
      open={visibleAddReward}
      footer={null}
      width={520}
      onCancel={() => {
        changeVisibleAddReward(false)
        formRef.resetFields()
      }}>
      {createReward?.isPending ? (
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
            label={<span className="font-medium">{trans("player.name")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("player.name")}
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
            name="imageLink"
            label={<span className="font-medium">{trans("reward.photo_link")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <Input
              placeholder={trans("reward.photo_link")}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              onBlur={(e) => {
                formRef.setFieldsValue({
                  imageLink: e.target.value.trim(),
                })
                formRef.validateFields(["image"])
              }}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label={<span className="font-medium">{trans("reward_config.quantity")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={1}
              step="1"
              controls={false}
              maxLength={11}
              placeholder={trans("reward_config.quantity")}
              className="w-full"
              stringMode
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
          <Form.Item
            name="started_at"
            label={trans("campaign.start_day")}
            rules={[{ required: true, message: trans("message.required") }]}>
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
            label={trans("campaign.end_date")}
            rules={[{ required: true, message: trans("message.required") }]}>
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
                changeVisibleAddReward(false)
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

import React, { useEffect, useState } from "react"
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Space, Spin, Switch, Typography, message } from "antd"
import { useUpdateReward } from "@/hook/useReward"
import LoadingMore from "@component/LoadingMore"
import { useGiftStore } from "@/store/usGift"
import { IUpdateRewardRequest } from "@/domain/Gift"
import { trans } from "@/locale"
import { SelectEvent } from "@/component/SelectEvent"
import dayjs from "dayjs"

export const UpdateReward: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const { visibleUpdateReward, changeVisibleUpdateReward, dataDetailReward, setDataDetailReward } = useGiftStore()
  
  const updateReward = useUpdateReward()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: updateReward.isPending || isClick, numberSetTimeOut: 1000 })

  console.log("dataDetailReward", dataDetailReward);
  

  useEffect(() => {
    formRef.setFieldsValue({
      name: dataDetailReward?.name,
      quantity: dataDetailReward?.quantity || "",
      imageLink: dataDetailReward?.image || "",
      isActive: dataDetailReward?.is_active,
      started_at: dayjs(dataDetailReward?.started_at) || "",
      ended_at: dayjs(dataDetailReward?.ended_at) || "",
      event_id: dataDetailReward?.event_id || "",
    })
  }, [dataDetailReward?.ended_at, dataDetailReward?.event_id, dataDetailReward?.image, dataDetailReward?.is_active, dataDetailReward?.name, dataDetailReward.price, dataDetailReward?.quantity, dataDetailReward?.started_at, formRef, visibleUpdateReward])

  const onUpdateReward = (values: any) => {
    const dataRequest: { params: IUpdateRewardRequest; id: number } = {
      params: {
        name: values?.name || "",
        quantity: values?.quantity || "",
        image: values?.imageLink || "",
        is_active: values?.isActive,
        started_at: values?.started_at ? dayjs(values?.started_at).toISOString() : "",
        ended_at: values?.ended_at ? dayjs(values?.ended_at).toISOString() : "",
        event_id: values?.event_id || "",
      },
      id: Number(dataDetailReward?.id),
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
      updateReward.mutateAsync(dataRequest).then((result: any) => {
        if (result?.status === 200) {
          message.success(trans("message.success"))
          changeVisibleUpdateReward(false)
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
      title={trans("reward.update_gift")}
      open={visibleUpdateReward}
      footer={null}
      width={520}
      onCancel={() => {
        changeVisibleUpdateReward(false)
        setDataDetailReward({})
        formRef.resetFields()
      }}>
      {updateReward?.isPending ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Form
          form={formRef}
          onFinish={onUpdateReward}
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
          <Row>
            <Col
              span={24}
              className="flex">
              <p className="mt-[0.3rem] mr-2 font-medium">
                <Typography.Text>{`Status:`}</Typography.Text>
              </p>
              <Form.Item
                name="isActive"
                valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(pre, next) => pre.isActive !== next.isActive}>
                {({ getFieldValue }) => <Typography.Text className="mt-[0.3rem] ml-2">{getFieldValue("isActive") ? trans("game.active") : trans('status.inactive')}</Typography.Text>}
              </Form.Item>
            </Col>
          </Row>
          <Space className="flex justify-end">
            <Button
              htmlType="button"
              loading={isLoadingMore}
              onClick={() => {
                changeVisibleUpdateReward(false)
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

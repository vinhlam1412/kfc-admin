import React, { useEffect, useState } from "react"
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Spin, Switch, Typography, message } from "antd"
import { useUpdateVoucher } from "@/hook/useGift"
import LoadingMore from "@/component/LoadingMore"
import { useGiftStore } from "@/store/usGift"
import dayjs from "dayjs"
import { IVoucherUpdate } from "@/domain/Gift"
import { trans } from "@/locale"
import { SelectEvent } from "@/component/SelectEvent"

export const UpdateVoucher: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const { visibleUpdateVoucher, changeVisibleUpdateVoucher, dataDetailVoucher, setDataDetailVoucher } = useGiftStore()

  const updateVoucher = useUpdateVoucher()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: updateVoucher.isPending || isClick, numberSetTimeOut: 1000 })

  useEffect(() => {
    formRef.setFieldsValue({
      isActive: dataDetailVoucher?.is_give,
      code: dataDetailVoucher?.code || "",
      started_at: dayjs(dataDetailVoucher?.started_at) || "",
      ended_at: dayjs(dataDetailVoucher?.ended_at) || "",
    })
  }, [dataDetailVoucher?.code, dataDetailVoucher?.ended_at, dataDetailVoucher?.is_give, dataDetailVoucher?.started_at, formRef, visibleUpdateVoucher])

  const onUpdateVoucher = (values: any) => {
    const dataRequest: { params: IVoucherUpdate; id: number } = {
      params: {
        is_give: values?.isActive,
        code: values?.code || "",
        started_at: values?.started_at ? dayjs(values?.started_at).toISOString() : "",
        ended_at: values?.ended_at ? dayjs(values?.ended_at).toISOString() : "",
        event_id: values?.event_id,
      },
      id: Number(dataDetailVoucher?.id),
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
      updateVoucher.mutateAsync(dataRequest).then((result: any) => {
        if (result?.status === 200) {
          message.success(trans("message.success"))
          changeVisibleUpdateVoucher(false)
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
      title={trans("gift.update_voucher")}
      open={visibleUpdateVoucher}
      footer={null}
      width={520}
      onCancel={() => {
        changeVisibleUpdateVoucher(false)
        setDataDetailVoucher({})
        formRef.resetFields()
      }}>
      {updateVoucher?.isPending ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Form
          form={formRef}
          onFinish={onUpdateVoucher}
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
          <Row>
            <Col
              span={24}
              className="flex">
              <p className="mt-[0.3rem] mr-2 font-medium">
                <Typography.Text>{trans("game.status")}:</Typography.Text>
              </p>
              <Form.Item
                name="isActive"
                valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(pre, next) => pre.isActive !== next.isActive}>
                {({ getFieldValue }) => <Typography.Text className="mt-[0.3rem] ml-2">{getFieldValue("isActive") ? "Đã trao" : "Chưa trao"}</Typography.Text>}
              </Form.Item>
            </Col>
          </Row>
          <Space className="flex justify-end">
            <Button
              htmlType="button"
              loading={isLoadingMore}
              onClick={() => {
                changeVisibleUpdateVoucher(false)
                setDataDetailVoucher({})
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

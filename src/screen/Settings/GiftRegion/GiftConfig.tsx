import React, { useEffect, useState } from "react"
import { Button, Col, Empty, Form, InputNumber, Modal, Row, Select, Space, Spin, Typography, message } from "antd"
import type { SelectProps } from "antd"
import { isEmpty, sortBy, sumBy } from "lodash"
import { useAreaQuery } from "@/hook/useArea"
import LoadingMore from "@/component/LoadingMore"
import { useInsertConfig, useUpdateWinningRate } from "@/hook/useGameConfig"
import { trans } from "@/locale"

interface Props {
  isLoading?: boolean
  data?: any
  config?: any
  event?: any
}

const GiftConfig = (props: Props) => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const [isResetForm, setIsResetForm] = useState(false)

  const { data: areaList } = useAreaQuery({ refetchOnMount: false })
  const updateWinningRate = useUpdateWinningRate()
  const insertConfig = useInsertConfig()

  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || updateWinningRate?.isPending || insertConfig?.isPending, numberSetTimeOut: 1000 })

  const listHeader = [
    { title: trans("setting.area"), span: 11, className: "ml-1.5", classCol: "", required: true },
    { title: `${trans("setting.percent")} (%)`, span: 10, className: "ml-2", classCol: "", required: true },
    { title: "Action", span: 3, className: "lg:ml-6", classCol: "", required: false },
  ]

  useEffect(() => {
    formRef.setFieldsValue({
      giftSetting: !isEmpty(props?.data)
        ? props?.data?.map((item: any) => ({ area: item?.code, rate: item?.rate }))
        : [
            {
              area: undefined,
              rate: undefined,
            },
          ],
    })
  }, [formRef, props?.data, isResetForm])

  // const divideBy100 = (number: number) => number / 100

  const onUpdateGiftSetting = (values: any) => {
    const winning_rate = values?.giftSetting?.map((item: any) => ({
      code: item?.area,
      rate: parseFloat(item?.rate),
    }))
    const isOneHundred = sumBy(winning_rate, "rate") <= 100
    if (!isOneHundred) {
      message.error(trans("setting.note_desc"))
      setCountMore((old: number) => old + 1)
      setIsClick(true)

      setTimeout(() => {
        setIsClick(false)
      }, 1000)
    } else {
      if (props?.config) {
        const params = Object.assign({}, props?.config.metadata)
        params.locations = winning_rate
        updateWinningRate.mutateAsync({data: params, event: props?.config.event_id}).then((result: any) => {
          if (result?.status === 200) {
            message.success(trans("message.success"))
          } else {
            message.error(result?.error?.message || trans("message.fail"))
          }
        })
      } else {
        const params = {
          event_id: props?.event,
          metadata: {
            combos: [],
            commoms: {
              total: 0,
              group_1: 0,
              group_2: 0,
              percent_per_week: 0,
              reward_items_per_week: []
            },
            locations: winning_rate
          }
        }
        insertConfig.mutateAsync(params).then((result: any) => {
          if (result?.status === 201 || result?.status === 200) {
            message.success(trans("message.success"))
          } else {
            message.error(result?.error?.message || trans("message.fail"))
          }
        })
      }
    }
  }

  const getAreaOptions = () => {
    let options: SelectProps["options"] = []
    if (isEmpty(areaList?.data)) {
      return []
    }
    options = areaList?.data?.map((item: any) => {
      return {
        value: item?.code,
        label: item?.name,
        disabled: formRef?.getFieldValue("giftSetting")?.some((el: any) => el?.area === item.code),
      }
    })
    return sortBy(options, ["label"])
  }

  return props?.isLoading || updateWinningRate?.isPending || insertConfig?.isPending ? (
    <div className="w-full h-[500px] flex justify-center items-center">
      <Spin />
    </div>
  ) : (
    <Form
      form={formRef}
      onFinish={onUpdateGiftSetting}
      disabled={true}
      layout="vertical">
      <div className="bg-gray-200 p-2 border-b-black mb-2 lg:w-2/3">
        <Row gutter={15}>
          {listHeader.map((item: { title: string; span: number; className?: string; classCol: string; required?: boolean }, index: number) => (
            <Col
              span={item.span}
              className={item?.classCol}
              key={index}>
              <Typography.Text
                strong
                className={item?.className}>
                {item.title}
                {item?.required && <span className="ml-1 text-red-500">*</span>}
              </Typography.Text>
            </Col>
          ))}
        </Row>
      </div>
      <Row className="pb-4 lg:w-2/3">
        <Col span={24}>
          <Form.List name={"giftSetting"}>
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ name, ...restField }) => (
                  <Row
                    className="pt-4"
                    key={name}
                    gutter={15}>
                    <Col span={11}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.giftSetting !== next?.giftSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "area"]}>
                              <Select
                                placeholder={trans("placeholder.select_area")}
                                options={getAreaOptions()}
                                getPopupContainer={(trigger) => trigger.parentNode}
                                optionFilterProp="children"
                                notFoundContent={<Empty />}
                                filterOption={(input: any, option: any) => {
                                  return (option?.children ?? "")?.toLowerCase().includes(input?.toLowerCase())
                                }}
                                filterSort={(optionA: any, optionB: any) => {
                                  return (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
                                }}></Select>
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.giftSetting !== next?.giftSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "rate"]}>
                              <InputNumber
                                min={0}
                                controls={false}
                                maxLength={3}
                                placeholder={`${trans("setting.percent")} (%)`}
                                className="w-full"
                                stringMode
                                parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
                                onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
                              />
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) =>
                          pre?.giftSetting[name]?.area !== next?.giftSetting[name]?.area ||
                          pre?.giftSetting[name]?.rate !== next?.giftSetting[name]?.rate ||
                          pre?.giftSetting !== next?.giftSetting
                        }>
                        {({ getFieldValue }) => {
                          const isDatalistArea = getAreaOptions()?.every((el: any) => el?.disabled)
                          const giftSettingLength = getFieldValue("giftSetting")

                          return (
                            <div className={`flex ${giftSettingLength?.length > 1 ? "justify-start" : "justify-center"}`}>
                              {fields.length > 1 && (
                                <Button
                                  type="default"
                                  className="mr-3"
                                  icon={<i className="fa-regular fa-trash w-8 text-[#e8262d] hover:opacity-70" />}
                                  onClick={() => {
                                    getFieldValue(["giftSetting", name, "area"]) || getFieldValue(["giftSetting", name, "rate"])
                                      ? Modal.confirm({
                                          title: trans("setting.title_delete_config"),
                                          okText: trans("button.agree"),
                                          cancelText: trans("button.cancel"),
                                          onOk: () => {
                                            remove(name)
                                          },
                                        })
                                      : remove(name)
                                  }}
                                />
                              )}
                              {name === fields.length - 1 && (
                                <Button
                                  className={`w-full ${
                                    !getFieldValue(["giftSetting", name, "area"]) || !getFieldValue(["giftSetting", name, "rate"]) || isDatalistArea
                                      ? ""
                                      : "hover:!border-[#3498db]"
                                  }`}
                                  onClick={() => {
                                    add()
                                  }}
                                  type="default"
                                  icon={<i className="fa-solid fa-plus text-[#3498db]" />}
                                  disabled={!getFieldValue(["giftSetting", name, "area"]) || !getFieldValue(["giftSetting", name, "rate"]) || isDatalistArea}
                                />
                              )}
                            </div>
                          )
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </Form.List>
        </Col>
      </Row>
      <div className="font-bold">
        {trans("setting.note")}: <span className="font-normal italic">{trans("setting.note_desc")}</span>
      </div>
      <Space className="flex justify-end lg:w-2/3">
        <Button
          htmlType="button"
          loading={isLoadingMore}
          onClick={() => {
            setIsResetForm(!isResetForm)
          }}>
          {trans("button.cancel")}
        </Button>
        <Button
          type="primary"
          loading={isLoadingMore}
          // disabled={isEmpty(props?.data)}
          htmlType="submit">
          {trans("button.save")}
        </Button>
      </Space>
    </Form>
  )
}

export default GiftConfig

import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, InputNumber, Modal, Row, Space, Spin, Typography, message } from "antd"
import { isEmpty } from "lodash"
import LoadingMore from "@/component/LoadingMore"
import { useInsertConfig, useUpdateProductForProgram } from "@/hook/useGameConfig"
import { trans } from "@/locale"

interface Props {
  isLoading?: boolean
  data?: any
  config?: any
  event?: any
}

const ProductConfig = (props: Props) => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)
  const [isResetForm, setIsResetForm] = useState(false)

  const updateProductForProgram = useUpdateProductForProgram()
  const insertConfig = useInsertConfig()

  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || updateProductForProgram?.isPending || insertConfig?.isPending, numberSetTimeOut: 1000 })

  const listHeader = [
    { title: trans("product.name"), span: 11, className: "ml-1.5", classCol: "", required: true },
    { title: trans("product.number_of_plays"), span: 10, className: "ml-2", classCol: "", required: true },
    { title: trans("game.action"), span: 3, className: "lg:ml-6", classCol: "", required: false },
  ]

  useEffect(() => {
    formRef.setFieldsValue({
      productSetting: !isEmpty(props?.data)
        ? props?.data?.map((item: any) => ({ productName: item?.code, rate: (item?.number_of_plays || 0) }))
        : [
            {
              productName: undefined,
              rate: undefined,
            },
          ],
    })
  }, [formRef, props?.data, isResetForm])

  const onUpdateProductSetting = (values: any) => {
    const combo = values?.productSetting?.map((item: any) => ({
      code: item?.productName,
      number_of_plays: item?.rate,
    }))
    
    setIsClick(true)
    setCountMore((old: number) => old + 1)

    setTimeout(() => {
      setIsClick(false)
    }, 1000)

    if (props?.config) {
      const params = Object.assign({}, props?.config.metadata)
      params.combos = combo
      updateProductForProgram.mutateAsync({data: params, event: props?.config.event_id}).then((result: any) => {
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
          combos: combo,
          commoms: {
            total: 0,
            group_1: 0,
            group_2: 0,
            percent_per_week: 0,
            reward_items_per_week: []
          },
          locations: []
        }
      }
      insertConfig.mutateAsync(params).then((result: any) => {
        if (result?.status === 200) {
          message.success(trans("message.success"))
        } else {
          message.error(result?.error?.message || trans("message.fail"))
        }
      })
    }
  }

  return props?.isLoading || updateProductForProgram?.isPending || insertConfig?.isPending ? (
    <div className="w-full h-[500px] flex justify-center items-center">
      <Spin />
    </div>
  ) : (
    <Form
      form={formRef}
      onFinish={onUpdateProductSetting}
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
          <Form.List name={"productSetting"}>
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
                        shouldUpdate={(pre, next) => pre?.productSetting !== next?.productSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "productName"]}>
                              <Input
                                placeholder={trans("product.name")}
                                onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
                                onBlur={(e) => {
                                  formRef.setFieldsValue({
                                    storeName: e.target.value.trim(),
                                  })
                                  formRef.validateFields(["code"])
                                }}
                              />
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.productSetting !== next?.productSetting}>
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
                                placeholder={trans("product.number_of_plays")}
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
                          pre?.productSetting[name]?.productName !== next?.productSetting[name]?.productName ||
                          pre?.productSetting[name]?.rate !== next?.productSetting[name]?.rate ||
                          pre?.productSetting !== next?.productSetting
                        }>
                        {({ getFieldValue }) => {
                          const productSettingLength = getFieldValue("productSetting")

                          return (
                            <div className={`flex ${productSettingLength?.length > 1 ? "justify-start" : "justify-center"}`}>
                              {fields.length > 1 && (
                                <Button
                                  type="default"
                                  className="mr-3"
                                  icon={<i className="fa-regular fa-trash w-8 text-[#e8262d] hover:opacity-70" />}
                                  onClick={() => {
                                    getFieldValue(["productSetting", name, "productName"]) || getFieldValue(["productSetting", name, "rate"])
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
                                    !getFieldValue(["productSetting", name, "productName"]) || !getFieldValue(["productSetting", name, "rate"])
                                      ? ""
                                      : "hover:!border-[#3498db]"
                                  }`}
                                  onClick={() => {
                                    add()
                                  }}
                                  type="default"
                                  icon={<i className="fa-solid fa-plus text-[#3498db]" />}
                                  disabled={!getFieldValue(["productSetting", name, "productName"]) || !getFieldValue(["productSetting", name, "rate"])}
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

export default ProductConfig

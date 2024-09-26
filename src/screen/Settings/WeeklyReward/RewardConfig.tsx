import React, { useEffect, useState } from "react"
import { Button, Col, Form, InputNumber, Row, Space, Spin, message } from "antd"
// import type { SelectProps } from "antd"
import { isEmpty } from "lodash"
import LoadingMore from "@/component/LoadingMore"
import { useInsertConfig, useUpdateConfigGift } from "@/hook/useGameConfig"
// import { useRewardQuery } from "@/hook/useReward"
import { IRewardRespond } from "@/domain/GameConfig"
import { trans } from "@/locale"

interface Props {
  isLoading?: boolean
  data?: IRewardRespond
  config?: any
  event?: any
}

const RewardConfig = (props: Props) => {
  const [formRef] = Form.useForm()
  // const [isClick, setIsClick] = useState(false)
  const [isResetForm, setIsResetForm] = useState(false)

  // const { data: rewardList } = useRewardQuery(
  //   { from: 0, to: 9999, name: "" },
  //   {
  //     refetchOnMount: false,
  //   },
  // )
  const updateConfigGif = useUpdateConfigGift()
  const insertConfig = useInsertConfig()
  // setCountMore,
  const { isLoadingMore } = LoadingMore({ isLoading: updateConfigGif?.isPending || insertConfig?.isPending, numberSetTimeOut: 1000 })

  // const listHeader = [
  //   { title: trans("reward_config.week"), span: 4, className: "ml-2", classCol: "", required: true },
  //   { title: trans("reward_config.gift"), span: 11, className: "ml-1.5", classCol: "", required: true },
  //   { title: trans("reward_config.quantity"), span: 5, className: "ml-2", classCol: "", required: true },
  //   { title: trans("game.action"), span: 4, className: "lg:ml-6", classCol: "", required: false },
  // ]

  useEffect(() => {
    formRef.setFieldsValue({
      total: props?.data?.total,
      group_1: props?.data?.group_1 || 0,
      group_2: props?.data?.group_2 || 0,
      max_scan_bill: props?.data?.max_scan_bill,
      max_number_of_spin: props?.data?.max_number_of_spin,
      max_number_of_plays: props?.data?.max_number_of_plays,
      time_block: props?.data?.time_block || 10,
      rewardSetting: !isEmpty(props?.data)
        ? props?.data?.reward_items_per_week
        : [
            {
              reward_id: undefined,
              quantity: undefined,
              at_week: undefined,
            },
          ],
    })
  }, [formRef, props?.data, isResetForm])

  // const divideBy100 = (number: number) => number / 100

  // const loadingValidate = (messError: string) => {
  //   message.error(messError || trans("message.fail"))
  //   setCountMore((old: number) => old + 1)
  //   setIsClick(true)

  //   setTimeout(() => {
  //     setIsClick(false)
  //   }, 1000)
  // }

  const onUpdateRewardSetting = (values: any) => {
    // const uniqueDataRewardSetting = uniqWith(values?.rewardSetting, (a: IRewardSetting, b: IRewardSetting) => `${a.reward_id}` === `${b.reward_id}` && `${a.at_week}` === `${b.at_week}`)
    const reward = {
      percent_per_week: props?.data?.percent_per_week || 0,
      total: values?.total || 0,
      group_1: values?.group_1 || 0,
      group_2: values?.group_2 || 0,
      reward_items_per_week: values?.rewardSetting,
      max_scan_bill: values?.max_scan_bill,
      max_number_of_spin: values?.max_number_of_spin,
      max_number_of_plays: values?.max_number_of_plays,
      time_block: values?.time_block,
    }
    // const isOneHundred = sum([Number(values?.group_1), Number(values?.group_2)]) <= 100

    // if (!isOneHundred) {
    //   loadingValidate(trans("reward_config.group1_group2_less_equal_100"))
    // } else if (uniqueDataRewardSetting?.length !== values?.rewardSetting?.length) {
    //   loadingValidate(trans("reward_config.week_gift_unique"))
    // } else {
    //   // đã đưa code ra ngoài bên dưới
    // }
    if (props?.config) {
      const params = Object.assign({}, props?.config.metadata)
      params.commoms = reward
      updateConfigGif.mutateAsync({ data: params, event: props?.config.event_id }).then((result: any) => {
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
          commoms: reward,
          locations: [],
        },
      }
      insertConfig.mutateAsync(params).then((result: any) => {
        if (result?.status === 201) {
          message.success(trans("message.success"))
        } else {
          message.error(result?.error?.message || trans("message.fail"))
        }
      })
    }
  }

  // const getRewardOptions = () => {
  //   let options: SelectProps["options"] = []
  //   if (isEmpty(rewardList?.data)) {
  //     return []
  //   }
  //   options = rewardList?.data?.map((item: any) => {
  //     return {
  //       value: item?.id,
  //       label: item?.name,
  //       // disabled: formRef?.getFieldValue("rewardSetting")?.some((el: any) => el?.reward_id === item.id),
  //     }
  //   })
  //   return sortBy(options, ["label"])
  // }

  // const Group1 = [trans("day.monday"), trans("day.tuesday"), trans("day.wednesday"), trans("day.thursday")]
  // const Group2 = [trans("day.friday"), trans("day.saturday"), trans("day.sunday")]

  // const validateUniquePairs = async (_: any, value: IRewardSetting[]) => {
  //   if (value) {
  //     const seen = new Set<string>()
  //     for (const item of value) {
  //       const pair = `${item.at_week}-${item.reward_id}`
  //       if (seen.has(pair)) {
  //         loadingValidate(trans("reward_config.week_gift_unique"))
  //         return Promise.reject('Each pair of week and gift must be unique')
  //       }
  //       seen.add(pair)
  //     }
  //   }
  //   return Promise.resolve()
  // }

  return props?.isLoading || updateConfigGif?.isPending || insertConfig?.isPending ? (
    <div className="w-full h-[500px] flex justify-center items-center">
      <Spin />
    </div>
  ) : (
    <Form
      form={formRef}
      onFinish={onUpdateRewardSetting}
      name="dynamic_form_nest_item"
      layout="vertical">
      <Row
        gutter={[30, 4]}
        className="mb-12 lg:w-2/3">
        {/* <Col span={24} md={12}>
          <Form.Item
            name="total"
            label={<span className="font-medium">Total number of vouchers</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Total number of vouchers"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col> */}
        {/* <Col span={24} md={12}>
          <Form.Item
            name="total"
            label={<span className="font-medium">Total number of CGV</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Total number of CGV"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col> */}
        {/* <Col span={24}>
          <Divider>Games</Divider>
        </Col> */}
        <Col
          span={24}
          md={12}>
          <Form.Item
            name="max_scan_bill"
            label={<span className="font-medium">Max scan bill</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Max scan bill"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col>
        {/* <Col span={24} md={12}>
          <Form.Item
            name="max_number_of_spin"
            label={<span className="font-medium">Max number of spin</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Max number of spin"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col> */}
        {/* <Col span={24} md={12}>
          <Form.Item
            name="max_number_of_plays"
            label={<span className="font-medium">Max number of plays</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Max number of plays"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col> */}
        <Col
          span={24}
          md={12}>
          <Form.Item
            name="time_block"
            label={<span className="font-medium">Time block (hours)</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={15}
              placeholder="Time block (hours)"
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item
            name="group_1"
            label={
              <span className="font-medium">
                {`${trans("reward_config.group_1")} (%): `}
                {Group1?.map((item, index: number) => (
                  <Tag
                    key={index}
                    color="magenta">
                    {`${item}`}
                  </Tag>
                ))}
              </span>
            }
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={3}
              placeholder={trans("setting.percent")}
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="group_2"
            label={
              <span className="font-medium">
                {`${trans("reward_config.group_2")} (%): `}
                {Group2?.map((item, index: number) => (
                  <Tag
                    key={index}
                    color="magenta">
                    {`${item}`}
                  </Tag>
                ))}
              </span>
            }
            rules={[{ required: true, message: trans("message.required") }]}>
            <InputNumber
              min={0}
              controls={false}
              maxLength={3}
              placeholder={trans("setting.percent")}
              className="w-full"
              stringMode
              parser={(value: any) => (value ? Number(parseInt(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, ""))) : 0)}
              onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            />
          </Form.Item>
        </Col>
        <div className="font-bold">
          {trans("setting.note")}: <span className="font-normal italic">{trans("reward_config.group1_group2_less_equal_100")}</span>
        </div> */}
      </Row>
      {/* <div className="bg-gray-200 p-2 border-b-black mb-2 lg:w-2/3">
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
          <Form.List name={"rewardSetting"} rules={[{validator: validateUniquePairs}]}>
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    className="pt-4"
                    key={key}
                    gutter={15}>
                    <Col span={4}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.rewardSetting !== next?.rewardSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "at_week"]}>
                              <InputNumber
                                min={0}
                                controls={false}
                                maxLength={3}
                                placeholder={trans("reward_config.week")}
                                className="w-full"
                                stringMode
                                onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
                              />
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.rewardSetting !== next?.rewardSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "reward_id"]}>
                              <Select
                                placeholder={trans("reward_config.select_gift")}
                                options={getRewardOptions()}
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
                    <Col span={5}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) => pre?.rewardSetting !== next?.rewardSetting}>
                        {() => {
                          return (
                            <Form.Item
                              {...restField}
                              className="!mb-0"
                              rules={[{ required: true, message: trans("message.required") }]}
                              name={[name, "quantity"]}>
                              <InputNumber
                                min={0}
                                controls={false}
                                maxLength={3}
                                placeholder={trans("reward_config.quantity")}
                                className="w-full"
                                stringMode
                                onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
                              />
                            </Form.Item>
                          )
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, next) =>
                          pre?.rewardSetting[name]?.reward_id !== next?.rewardSetting[name]?.reward_id ||
                          pre?.rewardSetting[name]?.quantity !== next?.rewardSetting[name]?.quantity ||
                          pre?.rewardSetting !== next?.rewardSetting
                        }>
                        {({ getFieldValue }) => {
                          const rewardSettingLength = getFieldValue("rewardSetting")

                          return (
                            <div className={`flex ${rewardSettingLength?.length > 1 ? "justify-start" : "justify-center"}`}>
                              {fields.length > 1 && (
                                <Button
                                  type="default"
                                  className="mr-3"
                                  icon={<i className="fa-regular fa-trash w-8 text-[#e8262d] hover:opacity-70" />}
                                  onClick={() => {
                                    getFieldValue(["rewardSetting", name, "reward_id"]) || getFieldValue(["rewardSetting", name, "quantity"]) || getFieldValue(["rewardSetting", name, "at_week"])
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
                                    !getFieldValue(["rewardSetting", name, "reward_id"]) || !getFieldValue(["rewardSetting", name, "quantity"]) || !getFieldValue(["rewardSetting", name, "at_week"])
                                      ? ""
                                      : "hover:!border-[#3498db]"
                                  }`}
                                  onClick={() => {
                                    add()
                                  }}
                                  type="default"
                                  icon={<i className="fa-solid fa-plus text-[#3498db]" />}
                                  disabled={
                                    !getFieldValue(["rewardSetting", name, "reward_id"]) || !getFieldValue(["rewardSetting", name, "quantity"]) || !getFieldValue(["rewardSetting", name, "at_week"])
                                  }
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
      </Row> */}
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

export default RewardConfig

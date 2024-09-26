import LoadingMore from "@/component/LoadingMore"
import { SelectEvent } from "@/component/SelectEvent"
import { IImportVoucherRequest } from "@/domain/Gift"
import { useImportVoucher } from "@/hook/useGift"
import { trans } from "@/locale"
import { useGiftStore } from "@/store/usGift"
import { UploadOutlined } from "@ant-design/icons"
import { Button, Col, Form, message, Row, Space, Typography } from "antd"
import dayjs from "dayjs"
import { isEqual } from "lodash"
import React, { useState } from "react"
import readXlsxFile from "read-excel-file"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

export const FormImport: React.FC = () => {
  const [formRef] = Form.useForm()
  const [isClick, setIsClick] = useState(false)

  const importVoucher = useImportVoucher()
  const { changeVisibleImportVoucher } = useGiftStore()
  const { setCountMore, isLoadingMore } = LoadingMore({ isLoading: isClick || importVoucher?.isPending, numberSetTimeOut: 1000 })

  const validateImportFileHeaders = (fileHeaders: any, expectHeaders: string[]) => {
    const isEqualData = isEqual(fileHeaders, expectHeaders)
    return isEqualData
  }

  const handleImportVoucher = (values: { file: File; event_id: number | string }) => {
    setCountMore((old: number) => old + 1)
    setIsClick(true)

    setTimeout(() => {
      setIsClick(false)
    }, 1000)

    // if (values.file.size > 5000000) {
    //   message.error(trans("gift.upload_file_less_than_500_mb"))
    // } 
    if (!values.file) {
      message.error(trans("gift_import.required_file"))
    } else {
      // const rows = await readXlsxFile(values.file)
      // if (rows?.length > 500) {
      //   message.error(trans("gift.upload_file_less_equal_500_line"))
      // } else {
        readXlsxFile(values.file).then((data) => {
          const headers = data?.shift()

          const validateHeaderErrors: boolean = validateImportFileHeaders(headers, [
            "Số TT",
            "Tên phần ăn",
            "Mã voucher *",
            "Mã Barcode/QRcode",
            "Ngày hiệu lực *",
            "Ngày hết hạn *",
            "Giá gốc",
            "Giá bán trên sàn",
          ])

          if (!validateHeaderErrors) {
            message.error(trans("file.invalid_format"))
            return
          }
          const dataRequest = []
          for (const item of data) {

            if (item?.[2] == null || item?.[4] == null || item?.[5] == null) {
              message.error(trans("file.format_require"))
              dataRequest.length = 0
              return
            }
            dataRequest.push({
              code: item[2],
              started_at: typeof item[4] === "string" ? dayjs.utc(item[4], "DD/MM/YYYY") : dayjs.utc(`${item[4]}`),
              ended_at: typeof item[5] === "string" ? dayjs.utc(item[5], "DD/MM/YYYY") : dayjs.utc(`${item[5]}`),
              event_id: values?.event_id,
              name: item[1] || "",
              barcode: item[3] || "",
            })
          }
          importVoucher.mutateAsync(dataRequest as unknown as IImportVoucherRequest[]).then((result: any) => {
            if (result?.status === 201) {
              message.success(trans("message.success"))
              formRef.resetFields()
              changeVisibleImportVoucher(false)
            } else {
              message.error(result?.error?.message || trans("message.fail"))
            }
          })
        })
      // }
    }
  }

  const setLabelCol = {
    xs: { span: 12 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 },
  }

  return (
    <Form
      form={formRef}
      onFinish={handleImportVoucher}
      layout="horizontal">
      <Row gutter={[0, 2]}>
        <Col span={24}>
          <Typography.Text>{`- ${trans("gift.download_sample_file_here")}: `} </Typography.Text>
          <a
            href={"/files/Import_Voucher_Template.xlsx"}
            rel="noreferrer"
            download="Import_Voucher_Template.xlsx"
            type="link">
            {trans("gift.download_template")}
          </a>
          {/* <Typography.Text className="block">
            {`- ${trans("gift.maximum_file_lines")}: `}
            <span className="font-bold">500 lines</span>
          </Typography.Text> */}
          {/* <Typography.Text className="block">
            {`- ${trans("gift.maximum_file_size")}: `}
            <span className="font-bold">5MB</span>
          </Typography.Text> */}
        </Col>
        <Col span={24}>
          <Form.Item
            labelAlign="left"
            labelCol={setLabelCol}
            name="event_id"
            className="w-[296px]"
            label={<span className="font-medium">{trans("gift.event")}</span>}
            rules={[{ required: true, message: trans("message.required") }]}>
            <SelectEvent refetchOnMount={false} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="file"
            hidden
          />
          <Button
            icon={<UploadOutlined />}
            onClick={() => document.getElementById("uploadFile")?.click()}>
            {trans("gift.choose_file_xlsx")}
          </Button>
          <input
            hidden
            className="!hidden"
            type="file"
            id="uploadFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            value=""
            onChange={(e) => {
              formRef.setFieldsValue({
                file: e.target.files ? e.target.files[0] : "",
              })
            }}
          />
          <Form.Item
            noStyle
            shouldUpdate={(pre, next) => pre.file !== next.file}>
            {({ getFieldValue }) =>
              getFieldValue("file") && (
                <div className="flex">
                  <p className="m-0 mt-1 ml-2">{getFieldValue("file")?.name}</p>
                  <Button
                    type="link"
                    icon={<i className="fa-solid fa-trash"></i>}
                    onClick={() => {
                      formRef.setFieldsValue({
                        file: "",
                      })
                    }}></Button>
                </div>
              )
            }
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
        <Space>
          <Button
            loading={isLoadingMore}
            type="default"
            onClick={() => {
              changeVisibleImportVoucher(false)
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
      </Row>
    </Form>
  )
}

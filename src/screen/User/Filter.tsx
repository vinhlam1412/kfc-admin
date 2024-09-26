import { Col, Form, Input, Row } from "antd"
import { debounce, forEach, isEmpty, omitBy } from "lodash"
import React, { useEffect } from "react"
import { NavigateOptions, URLSearchParamsInit } from "react-router-dom"
import { SearchOutlined } from "@ant-design/icons"
import { IPlayerQuery } from "@/domain/Players"
import { trans } from "@/locale"

interface Props {
  searchParams: any
  setSearchParams: (
    nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit) | undefined,
    navigateOpts?: NavigateOptions | undefined,
  ) => void
  setPlayersQuery: React.Dispatch<React.SetStateAction<IPlayerQuery>>
  playersQuery: IPlayerQuery
}

export const Filter: React.FC<Props> = ({ searchParams, setSearchParams, setPlayersQuery, playersQuery }) => {
  const [formRef] = Form.useForm()

  useEffect(() => {
    if (!isEmpty(Object.fromEntries(searchParams.entries()))) {
      const oldSearch = Object.fromEntries(searchParams.entries())
      formRef.setFieldsValue({
        ...oldSearch,
      })
    } else {
      formRef.resetFields()
    }
  }, [formRef, searchParams])

  const handleFilter = (values: any) => {
    const oldSearch = Object.fromEntries(searchParams.entries())

    setPlayersQuery({...playersQuery, text: values?.keyword || ""})
    setSearchParams(() => {
      let params: any = {
        ...oldSearch,
        ...values,
      }
      params = forEach(params, (v: any, k: string) => {
        if (typeof v === "string") v = v.trim()
        params[k] = v
      })
      params = omitBy(params, (v) => v === undefined || v === "")
      return params
    })
  }

  const onChange = (e: any) => {
    handleFilter({ keyword: e?.target?.value?.trim() })
  }

  const debouncedOnChange = debounce(onChange, 1000)

  return (
    <div className="pt-6">
      <Form
        form={formRef}
        layout="vertical">
        <Row gutter={12}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item name="keyword">
              <Input
                allowClear
                placeholder={trans("player.name_phone")}
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onBlur={(e) => {
                  handleFilter({ keyword: e?.target?.value?.trim() })
                }}
                onPressEnter={(e: any) => {
                  handleFilter({ keyword: e?.target?.value?.trim() })
                }}
                onChange={debouncedOnChange}
                onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

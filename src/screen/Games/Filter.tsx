import { Button, Col, Form, Input, Row } from "antd"
import { debounce, isEmpty } from "lodash"
import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SearchOutlined } from "@ant-design/icons"
import { trans } from "@/locale"

interface Props {
  setOpen: () => void
  setKeywork: React.Dispatch<React.SetStateAction<string>>
}

const Filter = (props: Props) => {
  const [formRef] = Form.useForm()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!isEmpty(Object.fromEntries(searchParams.entries()))) {
      const oldSearch = Object.fromEntries(searchParams.entries())
      formRef.setFieldsValue({
        ...oldSearch,
      })
      setSearchParams(searchParams)
    } else {
      formRef.resetFields()
    }

    // eslint-disable-next-line
  }, [formRef, searchParams])

  const onChange = (e: any) => {
    props?.setKeywork(e?.target?.value?.trim())
  }

  const debouncedOnChange = debounce(onChange, 1000)

  return (
    <div className="pt-7">
      <Form
        form={formRef}
        layout="vertical">
        <Row gutter={12}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item name="keywork">
              <Input
                placeholder={trans('game.name_game')}
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onChange={debouncedOnChange}
              />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 16 }}>
              <Button type="primary" className="float-end mr-3" onClick={() => props.setOpen()}>
                {trans('game.add_new_game')}
              </Button>
            </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Filter
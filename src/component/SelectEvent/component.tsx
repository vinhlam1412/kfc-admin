import React from "react"
import { Select, Spin } from "antd"
import lodash from "lodash"
import { SelectEventProps } from "@component/SelectEvent/container"
import { trans } from "@/locale"

export const SelectEventComponent = (props: SelectEventProps) => {
    const { options } = props

    return (
        <Select
            showSearch
            allowClear
            placeholder={trans("placeholder.select_event")}
            optionFilterProp="children"
            filterOption={(input: any, option: any) => {
                return (option?.children ?? "")?.toLowerCase()?.includes(input?.toLowerCase())
            }}
            filterSort={(optionA: any, optionB: any) => {
                return (optionA?.children ?? "")?.toLowerCase()?.localeCompare((optionB?.children ?? "")?.toLowerCase())
            }}
            notFoundContent={<Spin />}
            {...lodash.omit(props, "options")}>
            {options &&
                options?.map((item: any) => {
                    return (
                        <Select.Option
                            key={item?.id}
                            value={item?.id}>
                            {item?.name}
                        </Select.Option>
                    )
                })}
        </Select>
    )
}

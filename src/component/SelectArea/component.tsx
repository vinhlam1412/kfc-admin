import React from "react"
import { Select, Spin } from "antd"
import lodash from "lodash"
import { SelectAreaProps } from "@component/SelectArea/container"
import { trans } from "@/locale"

export const SelectAreaComponent = (props: SelectAreaProps) => {
    const { options } = props

    return (
        <Select
            showSearch
            allowClear
            placeholder={trans("placeholder.select_area")}
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
                            key={item?.code}
                            value={item?.code}>
                            {item?.name}
                        </Select.Option>
                    )
                })}
        </Select>
    )
}

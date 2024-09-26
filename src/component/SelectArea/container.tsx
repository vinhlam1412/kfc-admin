import React from "react"
import { SelectAreaComponent } from "@component/SelectArea/component"
import { SelectProps } from "antd"
import { useAreaQuery } from "@/hook/useArea"

export interface SelectAreaProps extends Omit<SelectProps, "options"> {
    refetchOnMount?: boolean
    options?: any
}
export const SelectArea = (props: SelectAreaProps) => {
    const { data: areaList, isLoading } = useAreaQuery({refetchOnMount: props?.refetchOnMount})

    return (
        <SelectAreaComponent
            loading={isLoading}
            options={areaList?.data}
            {...props}
        />
    )
}

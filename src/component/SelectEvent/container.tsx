import React from "react"
import { SelectEventComponent } from "@component/SelectEvent/component"
import { SelectProps } from "antd"
import { useAllEvent } from "@/hook/useGameConfig"

export interface SelectEventProps extends Omit<SelectProps, "options"> {
    refetchOnMount?: boolean
    options?: any
}
export const SelectEvent = (props: SelectEventProps) => {
    const { data: events, isLoading } = useAllEvent({refetchOnMount: props?.refetchOnMount})

    return (
        <SelectEventComponent
            loading={isLoading}
            options={events?.data}
            {...props}
        />
    )
}

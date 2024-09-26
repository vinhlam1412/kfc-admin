import React from "react"
import ProductConfig from "./ProductConfig"

interface Props {
  data?: any
  isLoading?: boolean
  config?: any
  event?: any
}

export const ProductForProgram: React.FC<Props> = (props: Props) => {

  return (
    <div className="relative">
      <ProductConfig
        data={props?.data || []}
        isLoading={props?.isLoading}
        config={props?.config}
        event={props?.event}
      />
    </div>
  )
}

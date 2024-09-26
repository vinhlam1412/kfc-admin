import { useEffect, useState } from "react";

interface Props {
    isLoading: boolean
    numberSetTimeOut: number
}

const LoadingMore=( props: Props ) => {
    const [ countMore, setCountMore ]=useState<number>( 0 )
    const [ isLoadingMore, setIsLoadingMore ]=useState<boolean>( false )

    useEffect( () => {
        if ( props.isLoading ) {
            setIsLoadingMore( true )
        } else {
            if ( countMore>0 ) {
                setTimeout( () => {
                    setIsLoadingMore( false )
                }, props.numberSetTimeOut )
            } else {
                setIsLoadingMore( false )
            }
        }
    }, [countMore, props.isLoading, props.numberSetTimeOut] )

    return {
        setCountMore,
        isLoadingMore
    }
}

export default LoadingMore
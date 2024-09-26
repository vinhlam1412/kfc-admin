import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GameConfigsApi from "@/api/GameConfigsApi"
import { message } from "antd"
import { IComboRequest, IWinningRateRequest } from "@/domain/GameConfig"
import { trans } from "@/locale"

type Options = {
    refetchOnMount?: boolean
}


export const useGameConfigAllQuery=( event: number, enabled : boolean) => {
    return useQuery( {
        queryKey: [ "game_config.get_all", event ],
        queryFn: async () => {
            return await GameConfigsApi.getAllConfig( event )
        },
        enabled
    } )
}

export const useUpdateWinningRate = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["game_config.update_winning_rate"],
        mutationFn: ( params: { data: IWinningRateRequest, event: number } ) => GameConfigsApi.updateWinningRate(params.data, params.event),
        onSuccess: ( _, variables ) => {
            queryClient.invalidateQueries( { queryKey: [ "game_config.get_all", variables.event ] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useUpdateConfigGift = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["game_config.update_gift"],
        mutationFn: ( params: { data: any, event: number } ) => GameConfigsApi.updateGift( params.data, params.event),
        onSuccess: ( _, variables ) => {
            queryClient.invalidateQueries( { queryKey: [ "game_config.get_all", variables.event ] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useUpdateProductForProgram = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["game_config.update_combo"],
        mutationFn: ( params: { data: IComboRequest[], event: number } ) => GameConfigsApi.updateCombo( params.data, params.event ),
        onSuccess: ( _, variables ) => {
            queryClient.invalidateQueries( { queryKey: [ "game_config.get_all", variables.event ] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useAllEvent = (options?: Options) => {
    return useQuery( {
        queryKey: [ "game_config.events" ],
        queryFn: async () => {
            return await GameConfigsApi.getListEvent()
        },
        refetchOnMount: options?.refetchOnMount ?? true,
    } )
}

export const useInsertConfig = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationKey: [ "game_config.insert" ],
        mutationFn: ( params: any ) => GameConfigsApi.insertConfigEvent( params ),
        onSuccess: ( _, variables ) => {
            queryClient.invalidateQueries( { queryKey: [ "game_config.get_all", variables.event_id ] } )
        },
        onError: ( errors: any ) => {
            message.error( errors?.response?.data?.message|| trans("message.fail") )
        },
    } )
}

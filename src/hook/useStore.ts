import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import StoresApi from "@/api/StoresApi"
import { message } from "antd"
import { IStoreUpdateRequest, IStoresQuery } from "@/domain/Store"
import { trans } from "@/locale"

export const useStoresQuery = ( params: IStoresQuery ) => {
    return useQuery( {
        queryKey: [ "store.get_list", params ],
        queryFn: async () => {
            return await StoresApi.getList(params)
        },
    } )
}

export const useCreateStore = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["store.create"],
        mutationFn: (params: any) => StoresApi.insertStore(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useDeleteStore = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["store.delete"],
        mutationFn: (code: number) => StoresApi.deleteStore(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useUpdateStore = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["store.update"],
        mutationFn: (data: { params: IStoreUpdateRequest, id: number }) => StoresApi.updateStore(data?.params, data?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["store.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useImportStore = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationKey: [ "store.import" ],
        mutationFn: ( params: any[] ) => StoresApi.importStore( params ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "store.get_list" ] } )
        },
        onError: ( errors: any ) => {
            message.error( errors?.response?.data?.message || trans( "message.fail" ) )
        },
    } )
}

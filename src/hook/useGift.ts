import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GiftsApi from "@/api/GiftsApi"
import { IGiftQuery, IImportVoucherRequest, IVoucherRequest, IVoucherUpdate } from "@/domain/Gift"
import { message } from "antd"
import { trans } from "@/locale"

export const useGiftsQuery = ( params: IGiftQuery ) => {
    return useQuery( {
        queryKey: [ "gift.get_list_voucher", params ],
        queryFn: async () => {
            return await GiftsApi.getListVoucher(params)
        },
    } )
}

export const useCreateVoucher = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.create_voucher"],
        mutationFn: (params: IVoucherRequest) => GiftsApi.insertVoucher(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_voucher"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useDeleteVoucher = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.delete_voucher"],
        mutationFn: (code: number) => GiftsApi.deleteVoucher(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_voucher"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useUpdateVoucher = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.update_voucher"],
        mutationFn: (data: { params: IVoucherUpdate, id: number }) => GiftsApi.updateVoucher(data?.params, data?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_voucher"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useImportVoucher = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.import_voucher"],
        mutationFn: (params: IImportVoucherRequest[]) => GiftsApi.importVoucher(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_voucher"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}
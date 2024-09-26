import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GiftsApi from "@/api/GiftsApi"
import { ICreateRewardRequest, IRewardQuery, IUpdateRewardRequest } from "@/domain/Gift"
import { message } from "antd"
import { trans } from "@/locale"

type Options = {
    refetchOnMount?: boolean
}

export const useRewardQuery = (params: IRewardQuery, options?: Options) => {
    return useQuery( {
        queryKey: [ "reward.get_list", params],
        queryFn: async () => {
            return await GiftsApi.getListRewards(params)
        },
        refetchOnMount: options?.refetchOnMount ?? true,
    } )
}

export const useCreateReward = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["reward.create"],
        mutationFn: (params: ICreateRewardRequest) => GiftsApi.insertReward(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reward.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useDeleteReward = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["reward.delete"],
        mutationFn: (code: number) => GiftsApi.deleteReward(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reward.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useUpdateReward = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.update_voucher"],
        mutationFn: (data: { params: IUpdateRewardRequest, id: number }) => GiftsApi.updateReward(data?.params, data?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reward.get_list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}
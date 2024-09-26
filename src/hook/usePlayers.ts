import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import PlayersApi from "@/api/PlayersApi"
import { IPlayerQuery, IUpdatePlayer } from "@/domain/Players"
import { message } from "antd"
import { trans } from "@/locale"

export const usePlayersQuery = ( params: IPlayerQuery ) => {
    return useQuery( {
        queryKey: [ "players.list", params ],
        queryFn: async () => {
            return await PlayersApi.getList(params)
        },
    } )
}

export const useDetailPlayerQuery = (code: number, enableDependOn: boolean) => {
    return useQuery({
        queryKey: ["players.get_detail", code],
        queryFn: () => PlayersApi.getDetail(code),
        enabled: enableDependOn
    })
}

export const useGiftPlayerQuery = ( code: number, enableDependOn: boolean ) => {
    return useQuery( {
        queryKey: [ "players.gift", code ],
        queryFn: () => PlayersApi.getGiftPlayer( code ),
        enabled: enableDependOn
    } )
}

export const useHistoryPlayerQuery = ( player: number, enableDependOn: boolean ) => {
    return useQuery( {
        queryKey: [ "players.history", player ],
        queryFn: () => PlayersApi.getGameByUserHistory( player ),
        enabled: enableDependOn
    } )
}



export const useUpdatePlayer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.update_voucher"],
        mutationFn: (data: { params: IUpdatePlayer, id: number }) => PlayersApi.updatePlayer(data?.params, data?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["players.list"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useTrackingPlayerQuery = ( player: number, enableDependOn: boolean ) => {
    return useQuery( {
        queryKey: [ "players.tracking", player ],
        queryFn: () => PlayersApi.getTrackingByPlayer( player ),
        enabled: enableDependOn
    } )
}

export const useBillPlayerQuery = ( player: number, enableDependOn: boolean ) => {
    return useQuery( {
        queryKey: [ "players.bill", player ],
        queryFn: () => PlayersApi.getBillPlayer( player ),
        enabled: enableDependOn
    } )
}

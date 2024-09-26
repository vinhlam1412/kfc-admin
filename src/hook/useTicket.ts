import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import GiftsApi from "@/api/GiftsApi"
import { ITicketQuery, ITicketRequest} from "@/domain/Gift"
import { message } from "antd"
import { trans } from "@/locale"

export const useTicketsQuery = ( params: ITicketQuery ) => {
    return useQuery( {
        queryKey: [ "gift.get_list_ticket", params ],
        queryFn: async () => {
            return await GiftsApi.getListTickets(params)
        },
    } )
}

export const useCreateTicket = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.create_ticket"],
        mutationFn: (params: ITicketRequest) => GiftsApi.insertTicket(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_ticket"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}

export const useImportTicket = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["gift.import_ticket"],
        mutationFn: (params: ITicketRequest[]) => GiftsApi.importTicket(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gift.get_list_ticket"] })
        },
        onError: (errors: any) => {
            message.error(errors?.response?.data?.message || trans("message.fail"))
        },
    })
}
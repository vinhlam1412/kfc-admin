import LogsApi from "@/api/LogApi"
import { useQuery } from "@tanstack/react-query"

export const useLogsEvent = ( params: { event: number, startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "logs.list", params ],
        queryFn: async () => {
            return await LogsApi.getList( params.event, params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const useLogsPlayer = ( player: number, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "logs.listPlayer", player ],
        queryFn: async () => {
            return await LogsApi.getLogByPlayer( player )
        },
        enabled
    } )
}

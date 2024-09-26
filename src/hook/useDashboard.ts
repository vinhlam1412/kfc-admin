import DashboardApi from "@/api/DashboardApi"
import { useQuery } from "@tanstack/react-query"

export const useEventStart = () => {
    return useQuery( {
        queryKey: [ "dashboard.eventStart" ],
        queryFn: async () => {
            return await DashboardApi.getEventStart()
        },
    } )
}

export const usePlayerWithGame = ( params: { startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.playerGame", params ],
        queryFn: async () => {
            return await DashboardApi.getPlayerWithGame( params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const useGameWithEvent = ( params: Array<number>, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.gameEvent", params ],
        queryFn: async () => {
            return await DashboardApi.getGameEvent( params )
        },
        enabled
    } )
}

export const useHistoryReward = ( params: { event: number, startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.historyReward", params ],
        queryFn: async () => {
            return await DashboardApi.getHistoryRewards( params.event, params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const useScoresByEvent = ( params: { event: number, startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.scoresByEvent", params ],
        queryFn: async () => {
            return await DashboardApi.getScoresByEvent( params.event, params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const useTrackingByEvent = ( params: { event: number, startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.trackingByEvent", params ],
        queryFn: async () => {
            return await DashboardApi.getTrackingByEvent( params.event, params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const useTotalPlayer=( params: { startDate?: string, endDate?: string } ) => {
    return useQuery( {
        queryKey: [ "dashboard.players", params ],
        queryFn: async () => {
            return await DashboardApi.getTotalPlayer( params?.startDate, params?.endDate )
        }
    } )
}

export const useGamePlayHistory=( params: { event: number, startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.gamePlayHistory", params ],
        queryFn: async () => {
            return await DashboardApi.getGamePlayHistory( params.event, params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const usePlayerGameHistory = ( params: { startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.playerHistoryGame", params ],
        queryFn: async () => {
            return await DashboardApi.getPlayGameHistory( params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const usePlayerWithGameByDate = ( params: { startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.playerGameByDate", params ],
        queryFn: async () => {
            return await DashboardApi.getPlayerWithGameByDate( params?.startDate, params?.endDate )
        },
        enabled
    } )
}

export const usePlayerGameHistoryByDate = ( params: { startDate?: string, endDate?: string }, enabled: boolean ) => {
    return useQuery( {
        queryKey: [ "dashboard.playerHistoryGameByDate", params ],
        queryFn: async () => {
            return await DashboardApi.getPlayGameHistoryByDate( params?.startDate, params?.endDate )
        },
        enabled
    } )
}

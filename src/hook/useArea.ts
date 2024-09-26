import { useQuery } from "@tanstack/react-query"
import AreasApi from "@/api/AreasApi"

type Options = {
    refetchOnMount?: boolean
}

export const useAreaQuery = (options?: Options) => {
    return useQuery( {
        queryKey: [ "area.get_list" ],
        queryFn: async () => {
            return await AreasApi.getList()
        },
        refetchOnMount: options?.refetchOnMount ?? true,
    } )
}
import GamesApi from "@/api/GamesApi"
import { DataGamesList } from "@/domain/Games"
import {  useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { message } from "antd"
import { isEmpty } from "lodash"

const fetcher = async (pageFrom: number, pageTo: number, text: string) => {
    const rs = await GamesApi.getList(pageFrom, pageTo, text)
    
    return {
      data: rs.data,
    }
  }

export const useGames = ({ initialData, pageFrom, pageTo, text }: { initialData?: DataGamesList , pageFrom: number, pageTo: number, text: string}) => {
    const fn = useInfiniteQuery({
        queryKey: ["useGetGames"],
        queryFn: () => fetcher(pageFrom, pageTo, text),
        initialPageParam: 0,
        initialData,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage: any) => {
          if (isEmpty(lastPage?.data)) {
            return undefined
          }
          return lastPage.pageNumber + 1
        },
    })

    return {
        ...fn,
    }
}

export const useGetListGame = (params: {pageFrom: number, pageTo: number, text: string}) => {
    return useQuery( {
        queryKey: [ "games.list", params],
        queryFn: async () => {
            return await GamesApi.getList(params.pageFrom, params.pageTo, params.text)
        },
    } )
}

export const useGameDetail = (id:number, enabled: boolean) => {
    return useQuery( {
        queryKey: [ "games.detail", id ],
        enabled:enabled,
        queryFn: async () => {
            return await GamesApi.getDetail(id)
        },
    } )
}

export const useUpdateGame = () => {
    return useMutation({
        mutationKey: ["game.update"],
        mutationFn: (params: any) => GamesApi.updateGame(params, params.id),
        onError: (errors: any) => {
            message.error(errors?.response?.data?.detail || "Thất bại")
        },
    })
};

export const useCreateGame = () => {
    return useMutation({
        mutationKey: ["game.create"],
        mutationFn: (params: any) => GamesApi.createGame(params),
        onError: (errors: any) => {
            message.error(errors?.response?.data?.detail || "Thất bại")
        },
    })
};

export const useDeleteGame = () => {
    return useMutation(
        {
            mutationFn: (id: number) => GamesApi.deleteGame(id),
            onError: (error: Error) => {
                console.error('Error deleting the game:', error);
            }
        }
    );
}

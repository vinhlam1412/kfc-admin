import EventsApi from "@/api/EventsApi"
import { DataEventsList } from "@/domain/Events"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { message } from "antd"
import { isEmpty } from "lodash"

export const useEventsQuery = () => {
    return useQuery( {
        queryKey: [ "events.list" ],
        queryFn: async () => {
            return await EventsApi.getOptions()
        },
    } )
}

const fetcher = async (pageForm: number, pageTo: number, text: string) => {
    const rs = await EventsApi.getList(pageForm, pageTo, text)
    
    return {
      data: rs.data,
    }
  }

export const useEvents = ({ initialData, pageFrom, pageTo, text }: { initialData?: DataEventsList , pageFrom: number, pageTo: number, text: string}) => {
    const fn = useInfiniteQuery({
        queryKey: ["useGetEvents"],
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

export const useGetListEvents = (params: {pageFrom: number, pageTo: number, text: string}) => {
  return useQuery( {
      queryKey: [ "events.listall", params],
      queryFn: async () => {
          return await EventsApi.getList(params.pageFrom, params.pageTo, params.text)
      },
  } )
}

export const useCreateEvent = () => {
  return useMutation({
      mutationKey: ["event.create"],
      mutationFn: (params: any) => EventsApi.createEvent(params),
      onError: (errors: any) => {
          message.error(errors?.response?.data?.detail || "Thất bại")
      },
  })
};

export const useEventDetail = (id:number, enabled: boolean) => {
  return useQuery( {
      queryKey: [ "event.detail", id ],
      enabled:enabled,
      queryFn: async () => {
          return await EventsApi.getDetail(id)
      },
  } )
}

export const useUpdateEvent = () => {
  return useMutation({
      mutationKey: ["event.update"],
      mutationFn: (params: any) => EventsApi.updateEvent(params, params.id),
      onError: (errors: any) => {
          message.error(errors?.response?.data?.detail || "Thất bại")
      },
  })
};

export const useDeleteEvent = () => {
  return useMutation(
    {
      mutationFn: (id: number) => EventsApi.deleteEvent(id),
      onError: (error: Error) => {
        console.error('Error deleting the game:', error);
      }
    }
  );
}

export const useCheckStatus = (params: {pageFrom: number, pageTo: number, text: string}) => {
  return useQuery( {
    queryKey: [ "events.checkstatus", params],
    queryFn: async () => {
      return await EventsApi.getCheckStatus(params.pageFrom, params.pageTo)
    },
  })
}
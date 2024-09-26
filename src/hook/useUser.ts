import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserApi from "@/api/UserApi"
import { message } from "antd"
import { trans } from "@/locale"

export const useUserQuery = () => {
    return useQuery( {
        queryKey: [ "user.get_list" ],
        queryFn: async () => {
            return await UserApi.getListUser()
        }
    } )
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationKey: [ "user.create" ],
        mutationFn: ( params: { email: string, password: string } ) => UserApi.insertUser( params ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "user.get_list" ] } )
        },
        onError: ( errors: any ) => {
            message.error( errors?.response?.data?.message|| trans("message.fail") )
        },
    } )
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationKey: [ "user.update" ],
        mutationFn: ( params: { email: string, password: string, id: string } ) => UserApi.updateUser( params, params.id ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "user.get_list" ] })
        },
        onError: ( errors: any ) => {
            message.error( errors?.response?.data?.message|| trans("message.fail") )
        },
    } )
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation( {
        mutationKey: [ "user.delete" ],
        mutationFn: (id: string ) => UserApi.deleteUser( id ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "user.get_list" ] } )
        },
        onError: ( errors: any ) => {
            message.error( errors?.response?.data?.message|| trans("message.fail") )
        },
    } )
}

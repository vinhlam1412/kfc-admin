import { ICreateRewardRequest, IImportVoucherRequest, IRewardQuery, ITicketQuery, ITicketRequest, IUpdateRewardRequest, IVoucherRequest, IVoucherUpdate } from "@/domain/Gift";
import supabase from "@/util/SupabaseClient";

export default class GiftsApi {
    static getListVoucher( params: { from: number, to: number, code?: string, is_give?: boolean } ) {
        const query=supabase.from( 'vouchers' ).select( 'id, created_at, started_at, ended_at, is_give, event_id, name, events (*)', { count: 'exact' } ).range( params.from, params.to ).order( 'id', { ascending: false } ).not( 'is_delete', 'eq', true )
        if ( params?.code )
            query.or( `code.ilike."*${ params?.code }*"` )
        if ( typeof params?.is_give !== "undefined" )
            query.eq( "is_give", params?.is_give )
        return query
    }

    static getVoucherDetail( id: number ) {
        return supabase.from( 'vouchers' ).select( '*' ).eq( "id", id )
    }

    static async insertVoucher( params: IVoucherRequest ) {
        return await supabase.from( 'vouchers' ).insert( [ params ] ).select()
    }

    static async updateVoucher( params: IVoucherUpdate, id: number ) {
        return await supabase.from( 'vouchers' ).update( params ).eq( "id", id ).select()
    }

    static async deleteVoucher( id: number ) {
        return await supabase.from( 'vouchers' ).update( {is_delete: true} ).eq( "id", id ).select()
    }

    static async importVoucher( params: IImportVoucherRequest[] ) {
        return await supabase.from( 'vouchers' ).insert( params ).select()
    }

    static getListRewards( params: IRewardQuery ) {
        const query=supabase.from( 'rewards' ).select( '*, events (*)', { count: 'exact' } ).range( params.from, params.to ).order( 'id', { ascending: false } ).not( 'is_delete', 'eq', true )
        if ( params?.name )
            query.or( `name.ilike."*${ params?.name }*"` )
        
        return query
    }

    static getRewardsDetail( id: number ) {
        return supabase.from( 'rewards' ).select( '*' ).eq( "id", id )
    }

    static async insertReward( params: ICreateRewardRequest ) {
        return await supabase.from( 'rewards' ).insert( [ params ] ).select()
    }

    static async updateReward( params: IUpdateRewardRequest, id: number ) {
        return await supabase.from( 'rewards' ).update( params ).eq( "id", id ).select()
    }

    static async deleteReward( id: number ) {
        return await supabase.from( 'rewards' ).update( { is_delete: true } ).eq( "id", id ).select()
    }

    static getListTickets( params: ITicketQuery ) {
        const query=supabase.from( 'tickets' ).select( 'id, created_at, name, event_id, is_gift, events (*)', { count: 'exact' } ).range( params.from, params.to ).order( 'id', { ascending: false } ).not( 'is_delete', 'eq', true )
        if ( params?.name )
            query.or( `name.ilike."*${ params?.name }*"` )

        return query
    }

    static getTicketDetail( id: number ) {
        return supabase.from( 'tickets' ).select( '*' ).eq( "id", id )
    }

    static async insertTicket( params: ITicketRequest ) {
        return await supabase.from( 'tickets' ).insert( [ params ] ).select()
    }

    static async updateTicket( params: any, id: number ) {
        return await supabase.from( 'tickets' ).update( params ).eq( "id", id ).select()
    }

    static async deleteTicket( id: number ) {
        return await supabase.from( 'tickets' ).update( { is_delete: true } ).eq( "id", id ).select()
    }

    static async importTicket( params: Array<ITicketRequest> ) {
        return await supabase.from( 'tickets' ).insert( params ).select()
    }
}

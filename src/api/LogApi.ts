import supabase from "@/util/SupabaseClient";

export default class LogsApi {
    static getList( event: number, startDate?: string, endDate?: string ) {
        const query =  supabase.from( 'logs' ).select( '*', { count: 'exact' } ).eq( "event_id", event )
        if ( startDate && endDate ) {
            query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
        }
        return query
    }

    static async getLogByPlayer( player: number ) {
        return await supabase.from( 'logs' ).select( '*', { count: 'exact' } ).eq( "player_id", player )
    }
}
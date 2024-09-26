import { IPlayerQuery, IUpdatePlayer } from "@/domain/Players";
import supabase from "@/util/SupabaseClient";

export default class PlayersApi {
    static getList(params: IPlayerQuery) {
        const query=supabase.from( 'players' ).select( '*', { count: 'exact' } ).range( params.from, params.to ).order( 'id', { ascending: false } )
        if ( params?.text )
            query.or( `name.ilike."*${ params?.text }*",phone.ilike."*${ params?.text }*"` )
        return query
    }

    static getDetail(id: number) {
        return supabase.from( 'players' ).select( '*' ).eq("id", id)
    }

    static getGiftPlayer(id: number) {
        return supabase.from( 'history_rewards' ).select( '*, vouchers (*), rewards (*), events (*), tickets (*)' ).eq( "player_id", id )
    }

    static async getGameByUserHistory( player: number ) {
        return supabase.from( "game_play_history" ).select( '*, games (*), events (*)', { count: 'exact' } ).eq( 'player_id', player )
    }

    static async updatePlayer( params: IUpdatePlayer, id: number ) {
        return await supabase.from( 'players' ).update( params ).eq( "id", id ).select()
    }

    static async getTrackingByPlayer( player: number ) {
        return await supabase.from( "tracking" ).select( "*, events (*), games (*)", { count: "exact" } ).eq( "player_id", player );
    }

    static async getBillPlayer( id: number ) {
        return await supabase.rpc( "report_user_logs_scan_bill", {
            p_player_id: id,
            p_event_id: null,
        } )
    }
}

import supabase from "@/util/SupabaseClient";

export default class ScoresApi {
    static getByUser( userId: number ) {
        const query = supabase.from( 'scores' ).select( `*, players (*), games (*), events (*)` ).eq( "player_id", userId )
       
        return query
    }
}

import supabase from "@/util/SupabaseClient";

export default class AreasApi {
    static getList() {
        return supabase.from( 'areas' ).select( '*', { count: 'exact' } ).order( 'id', { ascending: false } )
    }

    static getDetail( id: number ) {
        return supabase.from( 'areas' ).select( '*' ).eq( "id", id )
    }

    static async insertArea( params: { name: string, code: string } ) {
        return await supabase.from( 'areas' ).insert( [ params ] ).select()
    }

    static async updateArea( params: { name: string, code: string }, id: number ) {
        return await supabase.from( 'areas' ).update( params ).eq( "id", id ).select()
    }

    static async deleteArea( id: number ) {
        return await supabase.from( 'areas' ).delete().eq( "id", id )
    }
}

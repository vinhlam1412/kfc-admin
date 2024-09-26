import { IStoresQuery } from "@/domain/Store";
import supabase from "@/util/SupabaseClient";

export default class StoresApi {
    static getList( params: IStoresQuery ) {
        const query=supabase.from( 'stores' ).select( '*', { count: 'exact' } ).range( params.from, params.to ).order( 'id', { ascending: false } )
        if ( params.text )
            query.or( `name.ilike."*${ params?.text }*"` )
        return query
    }

    static getDetail( id: number ) {
        return supabase.from( 'stores' ).select( '*' ).eq( "id", id )
    }

    static async insertStore( params: any ) {
        return await supabase.from( 'stores' ).insert( [ params ] ).select()
    }

    static async importStore(params: any[]) {
        return await supabase.from( 'stores' ).insert( params ).select()
    }

    static async updateStore( params: any, id: number ) {
        return await supabase.from( 'stores' ).update( params ).eq( "id", id ).select()
    }

    static async deleteStore( id: number ) {
        return await supabase.from( 'stores' ).delete().eq( "id", id )
    }
}

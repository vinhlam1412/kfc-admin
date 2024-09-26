import supabase from "@/util/SupabaseClient";

export default class GamesApi {
    static getList(pageForm: number, pageTo: number, text: string) {
        const query = supabase.from( 'games' ).select( '*', { count: 'exact' } ).range( pageForm, pageTo).order('id', { ascending: false }).not('is_delete', 'eq', true)
        if ( text ){ 
            query.or( `name.ilike."*${ text }*"` )
        }
        return query
    }

    static getDetail(id: number) {
        return supabase.from( 'games' ).select( '*' ).eq("id", id)
    }

    static async updateGame(param: any, id: number) {
        const res = await supabase
            .from('games')
            .update(param)
            .eq('id', id);

        if (res.data) {
            throw new Error(res.error?.message);
        }
        return res
    }

    static async createGame(param: any) {
        const res = await supabase
            .from('games')
            .insert(param)

        if (res.data) {
            throw new Error(res.error?.message);
        }
        return res
    }

    static async deleteGame(id: number) {
        const res = await supabase.from( 'games' ).update({'is_delete': true, 'id': id}).eq('id', id)
        return res
    }
}

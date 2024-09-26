import supabase from "@/util/SupabaseClient";

export default class EventsApi {
    static getList(pageForm: number, pageTo: number, text: string) {
        const query=supabase.from( 'events' ).select( '*', { count: 'exact' } ).range( pageForm, pageTo).order('id', { ascending: false }).not('is_delete', 'eq', true)
        if ( text ){ 
            query.or( `name.ilike."*${ text }*"` )
        }
        return query
    }

    static async getOptions() {
        const query = supabase.from( 'events' ).select( '*' )
        return query
    }

    static async createEvent(param: any) {
        const res = await supabase
            .from('events')
            .insert(param)

        if (res.data) {
            throw new Error(res.error?.message);
        }
        return res
    }

    static getDetail(id: number) {
        return supabase.from( 'events' ).select( '*' ).eq("id", id)
    }

    static async updateEvent(param: any, id: number) {
        const res = await supabase
            .from('events')
            .update(param)
            .eq('id', id);

        if (res.data) {
            throw new Error(res.error?.message);
        }
        return res
    }

    static async deleteEvent(id: number) {
        const res = await supabase.from( 'events' ).update({'is_delete': true, 'id': id}).eq('id', id)
        return res
    }
    
    static getCheckStatus(pageForm: number, pageTo: number) {
        const query=supabase.from( 'events' ).select( '*' ).range( pageForm, pageTo).order('id', { ascending: false }).not('is_delete', 'eq', true).eq('is_start', true)
        return query
    }
}

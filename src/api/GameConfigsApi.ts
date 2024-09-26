import { IComboRequest, IWinningRateRequest } from "@/domain/GameConfig";
import supabase from "@/util/SupabaseClient";

export default class GameConfigsApi {
    static getAllConfig(event: number) {
        return supabase.from( 'game_configs' ).select( '*' ).eq("event_id", event)
    }

    static async updateCombo( params: IComboRequest[], event: number ) {
        return await supabase.from( 'game_configs' ).update( { metadata: params } ).eq( "event_id", event ).select()
    }

    static async updateGift( params: { group_1: number, group_2: number, total_per_week: number, reward_items_per_week: Array<number> }, event: number ) {
        return await supabase.from( 'game_configs' ).update( { metadata: params } ).eq( "event_id", event ).select()
    }

    static async updateWinningRate( params: IWinningRateRequest, event: number ) {
        return await supabase.from( 'game_configs' ).update( { metadata: params } ).eq( "event_id", event ).select()
    }

    static async getListEvent() {
        return await supabase.from( 'events' ).select( '*', { count: 'exact' } ).order( 'id', { ascending: false } ).not( 'is_delete', 'eq', true )
    }

    static async insertConfigEvent(params: any) {
        return await supabase.from( 'game_configs' ).insert( [params] ).select()
    }
}

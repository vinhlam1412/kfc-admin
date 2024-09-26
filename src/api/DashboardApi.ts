import supabase from "@/util/SupabaseClient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default class DashboardApi {
  static getNewPlayerWithDay() {
    return supabase
      .from("players")
      .select("*", { count: "exact" })
      .gte("created_at", dayjs().utc().startOf("day").format())
      .lte("created_at", dayjs().utc().endOf("day").format());
  }

  static getNewPlayerWithWeek(startDate: string, endDate: string) {
    return supabase
      .from("players")
      .select("*", { count: "exact" })
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  static getTotalGame() {
    return supabase.from("games").select("*", { count: "exact" });
  }

  static async getTotalPlayer( startDate?: string, endDate?: string ) {
    const query = supabase.from("players").select("*", { count: "exact" });
    if ( startDate && endDate ) {
      query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
    }
    return await query
  }

  static getEventStart() {
    return supabase.from("events").select("*").eq("is_start", true);
  }

  static getPlayerWithGame( startDate?: string, endDate?: string ) {
    if ( startDate && endDate )
      return supabase.rpc( "get_player_count_per_game", {
        start_date: startDate,
        end_date: endDate,
      } )
    return supabase.rpc( "get_player_count_per_game")
  }

  static getGameEvent(games: Array<number>) {
    return supabase.from("games").select("*").in("id", games);
  }

  static getHistoryRewards( event: number, startDate?: string, endDate?: string ) {
    const query = supabase.from( "history_rewards" ).select( "*", { count: "exact" } ).eq( "event_id", event )
    if ( startDate && endDate ) {
      query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
    }
    return query
  }

  static getScoresByEvent( event: number, startDate?: string, endDate?: string ) {
    const query = supabase.from( "game_play_history" ).select( "*", { count: "exact" } ).eq( "event_id", event );
    if ( startDate && endDate ) {
      query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
    }
    return query
  }

  static async getTrackingByEvent( event: number, startDate?: string, endDate?: string ) {
    const query = supabase.from( "tracking" ).select( "*", { count: "exact" } ).eq( "event_id", event );
    if ( startDate && endDate ) {
      query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
    }
    return await query
  }

  static async getGamePlayHistory( event: number, startDate?: string, endDate?: string ) {
    const query = supabase.from( "game_play_history" ).select( "*", { count: "exact" } ).eq( "event_id", event );
    if ( startDate && endDate ) {
      query.gte( 'created_at', startDate ).lte( 'created_at', endDate )
    }
    return await query
  }

  static getPlayGameHistory( startDate?: string, endDate?: string ) {
    if ( startDate && endDate )
      return supabase.rpc( "get_game_history", {
        start_date: startDate,
        end_date: endDate,
      } )
    return supabase.rpc( "get_game_history" )
  }

  static getPlayerWithGameByDate( startDate?: string, endDate?: string ) {
    if ( startDate && endDate )
      return supabase.rpc( "get_player_count_per_game_by_date", {
        start_date: startDate,
        end_date: endDate,
      } )
    return supabase.rpc( "get_player_count_per_game_by_date" )
  }

  static getPlayGameHistoryByDate( startDate?: string, endDate?: string ) {
    if ( startDate && endDate )
      return supabase.rpc( "get_game_history_by_date", {
        start_date: startDate,
        end_date: endDate,
      } )
    return supabase.rpc( "get_game_history_by_date" )
  }
}

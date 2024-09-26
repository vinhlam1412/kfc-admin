import { IPlayer } from "./Players";

export interface IScore {
    created_at?: string;
    game_id?: number;
    id?: number;
    player_id?: number;
    score?: number;
    updated_at?: string;
    games?: IGames
    players?: IPlayer
  }

export interface IGames {
    created_at?: string;
    created_by?: any;
    description?: string;
    id?: number;
    is_active?: boolean;
    is_test?: boolean;
    name?: string;
    update_at?: any;
    updated_by?: any;
    url?: string;
    icon?: string
  }
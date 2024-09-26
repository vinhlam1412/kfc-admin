export interface IPlayer {
  alternative_name?: string;
  alternative_phone?: string;
  avatar?: any;
  created_at?: string;
  created_by?: string;
  email?: any;
  id?: number;
  is_following_oa?: boolean;
  name?: string;
  number_of_times_played?: number;
  number_of_times_spined?: number;
  phone?: string;
  total_score?: number;
  zalo_id?: string;
  is_block?: boolean
  expired_block: any
}

export interface IPlayerQuery {
  from: number
  to: number
  text?: string
}

export interface IUpdatePlayer {
  is_block: boolean
  expired_block: null
}
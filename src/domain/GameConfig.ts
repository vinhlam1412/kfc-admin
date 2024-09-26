export interface IWinningRateRequest {
  code: string
  rate: number
}
export interface IRewardRespond {
  group_1: number;
  group_2: number;
  reward_items_per_week: Array<number>;
  total: number;
  percent_per_week: number
  max_scan_bill: number
  max_number_of_spin: number
  max_number_of_plays: number
  time_block: number
}

export interface IComboRequest {
  code: string
  number_of_plays: number
}

export interface IRewardSetting {
  at_week: number | string
  reward_id: number | string
  quantity: number | string
}
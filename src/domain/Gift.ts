export interface IGiftQuery {
  from: number
  to: number
  code?: string
  is_give?: boolean
}

export interface IGift {
  code?: string;
  created_at?: string;
  created_by?: any;
  ended_at?: string;
  id: number;
  is_give?: boolean;
  started_at?: string;
}

export interface IVoucherRequest {
  code: string
  started_at: string
  ended_at: string
  event_id?: number
}

export interface IVoucherUpdate {
  code: string
  started_at: string
  ended_at: string
  event_id?: number
  is_give: boolean
}

export interface IRewardQuery {
  from: number
  to: number
  name?: string
}

export interface IRewardRespond {
  code: string;
  created_at: string;
  id: number;
  image?: string;
  is_active: boolean;
  name: string;
  price?: any;
  quantity: number;
  type?: any;
  started_at?: string
  ended_at?: string
  event_id?: number
}

export interface ICreateRewardRequest {
  name: string
  image: string
  quantity: number
  started_at: string
  ended_at: string
  event_id: number
  is_delete?: boolean
}

export interface IUpdateRewardRequest {
  name: string
  image: string
  is_active: boolean
  quantity: number
  started_at: string
  ended_at: string
  event_id: number
}

export interface IImportVoucherRequest {
  code: string
  started_at: string
  ended_at: string
  event_id: number
  name: string
  barcode: string
}

export interface ITicketQuery {
  from: number
  to: number
  name?: string
}

export interface ITicketRequest {
  name: string
  serial_no: string
  pin_no: string
  event_id: number | string
}
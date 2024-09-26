export interface IStores {
  address?: string;
  area?: string;
  code?: string;
  created_at?: string;
  created_by?: any;
  id: number;
  name?: string;
  store_id?: number;
  updated_at?: any;
  updated_by?: any;
}

export interface IStoresQuery {
  from: number
  to: number
  text?: string
}

export interface IStoreUpdateRequest {
  address: string;
  area: string;
  name: string;
  code: string;
  store_id: number;
}
export interface IUser {
    username: string
    email: string
    fullname: string
    avatar: string
    gender: string
    birthday: Date
    createdAt: Date
    updatedAt: Date
    config: JSON
}

export interface IUserRespond {
    aud: string;
    confirmed_at: string;
    created_at: string;
    email: string;
    email_confirmed_at: string;
    id: string;
    identities?: any;
    is_anonymous: boolean;
    last_sign_in_at: string;
    phone: string;
    role: string;
    updated_at: string;
    user_metadata?: any
    app_metadata?: {
        provider?: string
        providers?: string[]
    }
  }
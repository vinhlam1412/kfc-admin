import supabase from "@/util/SupabaseClient";

export default class UserApi {
  static async getListUser() {
    return await supabase.auth.admin.listUsers()
  }

  static async getUserDetail( id: string ) {
    return await supabase.auth.admin.getUserById( id )
  }

  static async insertUser( params: { email: string, password: string } ) {
    return await supabase.auth.admin.createUser( params )
  }

  static async updateUser( params: { email: string, password: string }, id: string ) {
    return await supabase.auth.admin.updateUserById( id, params )
  }

  static async deleteUser( id: string ) {
    return await supabase.auth.admin.deleteUser( id )
  }
}

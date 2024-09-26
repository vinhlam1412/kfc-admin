import supabase from "@/util/SupabaseClient"

export default class UserApi {
  static getCurrentUser() {
    return supabase.from("my_table").select("*")
  }

  static insertCurrentUser() {
    return supabase.from("my_table").insert([{ name: "test" }])
  }
}

// .eq( column, value ): Bằng( equal )
// .gt( column, value ): Lớn hơn( greater than )
// .neq(column, value): Không bằng (not equal)
// .lt(column, value): Nhỏ hơn (less than)
// .gte(column, value): Lớn hơn hoặc bằng (greater than or equal)
// .lte(column, value): Nhỏ hơn hoặc bằng (less than or equal)
// .like(column, pattern): Tương tự (like)
// .ilike(column, pattern): Tương tự không phân biệt chữ hoa chữ thường (case insensitive like)
// .is(column, value): Là (is) - sử dụng cho NULL và TRUE/FALSE

// const { data, error } = await supabase.auth.signUp( {
//     email,
//     password,
// } );

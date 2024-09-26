import { localStore } from "@util/LocalStore"
import supabase from "./SupabaseClient"

export class SecurityService {
  static can = (permission: string) => {
    const permissions = localStore.getJson("permissions") || []
    return permissions.includes(permission)
  }

  static isLogged = () => {
    const savedSession = localStorage.getItem("supabaseSession")
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        localStore.setItem("supabaseSession", JSON.stringify(session))
      } else {
        localStore.removeItem("supabaseSession")
      }
    })
    return !!savedSession
  }

  static getUser = () => {
    if (SecurityService.isLogged()) {
      return localStore.getJson("supabaseUser")
    }
    return null
  }
}

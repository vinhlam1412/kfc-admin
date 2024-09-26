import appConfig from "@/config/app"
import { createClient } from "@supabase/supabase-js"

const supabase=createClient( appConfig.supabaseUrl, appConfig.supabaseServiceRole )

export default supabase

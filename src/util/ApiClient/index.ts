import { apiClient } from "./ApiClient"
import appConfig from "@config/app"
import {localStore} from "@util/LocalStore"
import { get } from "lodash"

const defaultApiClient = apiClient({
    baseURL: appConfig.apiUrl,
    bearerToken: get(localStore.getJson("loginSession"), "accessToken"),
})

export { defaultApiClient }

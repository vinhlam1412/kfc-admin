import { matchRoutes, useLocation } from "react-router-dom"

import { IRouteConfig, routes } from "@config/route"

export const useCurrentRoute = (): IRouteConfig | null => {
    const location = useLocation()
    const matches: any = matchRoutes(
        routes.map((item) => ({ path: item.path })),
        location
    )
    let currentRoute = null

    if (Array.isArray(matches)) {
        for (const it of routes) {
            for (const mr of matches) {
                if (mr.route.path === it.path) {
                    currentRoute = it
                    break
                }
            }
        }
    }

    return currentRoute
}

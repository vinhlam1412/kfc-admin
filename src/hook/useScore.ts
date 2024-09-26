import { useQuery } from "@tanstack/react-query"
import ScoresApi from "@/api/ScoresApi"

export const useScoreByUserQuery = (code: number, enableDependOn: boolean) => {
    return useQuery({
        queryKey: ["score.get_by_user", code],
        queryFn: () => ScoresApi.getByUser(code),
        enabled: enableDependOn
    })
}

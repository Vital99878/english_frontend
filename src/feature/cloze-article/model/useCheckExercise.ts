// src/features/cloze-article/model/useCheckExercise.ts
import {useMutation} from '@tanstack/react-query'
import {CheckResult} from "@/entities/exercise/types";
import {useServices} from "@/app/providers/ServicesProvider";


export function useCheckExercise(slug: string) {
    const {exerciseApi} = useServices()
    return useMutation({
        mutationFn: async (fields: Record<string, string>): Promise<CheckResult> => {
            return await exerciseApi.check(slug, fields)
        },
        onSuccess: (res) => {
            console.debug(res)
        },
    })
}

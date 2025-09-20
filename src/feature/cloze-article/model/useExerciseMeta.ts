// src/features/cloze-article/model/useExerciseMeta.ts
import {useQuery} from '@tanstack/react-query'
import {useServices} from "@/app/providers/ServicesProvider";


export function useExerciseMeta(slug: string) {
    const {exerciseApi} = useServices()
    return useQuery({
        queryKey: ['exercise-meta', slug],
        queryFn: async () => {
            return exerciseApi.getMeta(slug)
        }
    })
}

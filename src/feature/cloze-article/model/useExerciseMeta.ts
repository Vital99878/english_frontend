// src/features/cloze-article/model/useExerciseMeta.ts
import {useQuery} from '@tanstack/react-query'
import {ExerciseApi} from "@/entities/exercise/api/exercise.api";
import {Exercise} from "@/entities/exercise/types";


export type UseExerciseMetaOptions = {
    exerciseApi: ExerciseApi
    enabled?: boolean
}


export function useExerciseMeta(slug: string, opts: UseExerciseMetaOptions) {
    const {
        exerciseApi,
        enabled = true,
    } = opts


    return useQuery({
        queryKey: ['exercise-meta', slug],
        enabled: Boolean(slug && enabled),
        queryFn: async (): Promise<Exercise> => {
            return await exerciseApi.getMeta(slug)
        },
    })
}

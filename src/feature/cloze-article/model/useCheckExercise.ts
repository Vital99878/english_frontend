// src/features/cloze-article/model/useCheckExercise.ts
import {useMutation} from '@tanstack/react-query'
import {CheckResult as ApiCheckResult} from "@/entities/exercise/types";
import {useServices} from "@/app/providers/ServicesProvider";
import {CheckResult, FieldResult} from "./types";

const mapStatus = (detail: ApiCheckResult['details'][number]): FieldResult => {
    if (detail.correct) {
        return {status: 'ok'}
    }

    const expected = detail.expected?.filter(Boolean) ?? []
    const message = expected.length > 0
        ? `Expected: ${expected.join(', ')}`
        : undefined

    return {
        status: 'wrong',
        message,
    }
}

const mapOverall = (result: ApiCheckResult): CheckResult['overall'] => {
    if (result.correct) return 'correct'
    if (result.score > 0) return 'partial'
    return 'wrong'
}

const mapCheckResult = (result: ApiCheckResult): CheckResult => {
    const fieldResults: Record<string, FieldResult> = {}

    for (const detail of result.details) {
        fieldResults[detail.blankId] = mapStatus(detail)
    }

    return {
        overall: mapOverall(result),
        fieldResults,
    }
}


export function useCheckExercise(slug: string) {
    const {exerciseApi} = useServices()
    return useMutation({
        mutationFn: async (fields: Record<string, string>): Promise<CheckResult> => {
            const response = await exerciseApi.check(slug, fields)
            return mapCheckResult(response)
        },
    })
}

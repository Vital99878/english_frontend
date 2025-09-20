// src/features/cloze-article/model/useExerciseMeta.ts
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosInstance } from 'axios'

export type ExerciseMetaDTO_Legacy = {
    slug: string
    template: string
    aria?: Record<string, string>
}

export type ExerciseMetaDTO_New = {
    id: string
    kind: 'cloze'
    prompt?: string
    payload: {
        text: string                       // e.g. "Yesterday I __b1__ ... __b2__ ..."
        blanks: Array<{
            id: string
            accept: string[]
            caseSensitive?: boolean
            placeholder?: string
            ariaLabel?: string
        }>
    }
}

export type ExerciseMetaAdapted = {
    slug: string
    template: string                     // "Yesterday I {{b1}} ... {{b2}} ..."
    aria?: Record<string, string>        // { b1: '...', b2: '...' }
}

export type UseExerciseMetaOptions = {
    axiosInstance?: AxiosInstance
    buildMetaUrl?: (slug: string) => string
    enabled?: boolean
}

function adapt(dto: ExerciseMetaDTO_Legacy | ExerciseMetaDTO_New): ExerciseMetaAdapted {
    // формат 1: уже как надо
    if ('template' in dto && typeof dto.template === 'string') {
        return { slug: dto.slug, template: dto.template, aria: dto.aria }
    }

    // формат 2: payload.text + __id__
    const slug = (dto as ExerciseMetaDTO_New).id
    const payload = (dto as ExerciseMetaDTO_New).payload

    // Заменим __b1__ → {{b1}}
    const template = (payload?.text || '').replace(/__([a-zA-Z0-9_-]+)__/g, '{{$1}}')

    // Соберём aria по blanks (если нет ariaLabel — можно подставить prompt или id)
    const aria: Record<string, string> = {}
    for (const b of payload?.blanks || []) {
        aria[b.id] = b.ariaLabel || `Blank ${b.id}`
    }

    return { slug, template, aria }
}

export function useExerciseMeta(slug: string, opts: UseExerciseMetaOptions = {}) {
    const {
        axiosInstance,
        buildMetaUrl = (s: string) => `/api/exercises/${s}`,
        enabled = true,
    } = opts

    const http = axiosInstance ?? axios.create()

    return useQuery({
        queryKey: ['exercise-meta', slug],
        enabled: Boolean(slug && enabled),
        queryFn: async (): Promise<ExerciseMetaAdapted> => {
            const { data } = await http.get(buildMetaUrl(slug))
            return adapt(data as ExerciseMetaDTO_Legacy | ExerciseMetaDTO_New)
        },
    })
}

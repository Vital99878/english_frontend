import { HttpClient } from 'shared/api/HTTPClient'
import { ExerciseApi } from '@/entities/exercise/api/exercise.api'

export type Services = {
    exerciseApi: ExerciseApi
}

export function createServices(): Services {
    // базовый HTTP (можно читать BASE_URL из env)
    const http = new HttpClient({
        baseURL: import.meta.env.VITE_API_BASE_URL || '',
        timeoutMs: 15000,
        headers: { 'X-App': 'cloze-frontend' },
    })

    // тут инстанцируем все API-клиенты
    const exerciseApi = new ExerciseApi(
        http,
        (slug) => `/api/exercises/${slug}`,
        (slug) => `/api/exercises/${slug}/check`,
    )

    return { exerciseApi }
}

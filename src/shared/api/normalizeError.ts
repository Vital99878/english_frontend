import {HttpError} from "./httpClient.type";
import axios, {isAxiosError} from "axios";

/** Нормализатор ошибок */
export function normalizeError(err: unknown): HttpError {
    // Отмена запроса (AbortController/CancelToken)
    if (axios.isCancel && axios.isCancel(err)) { // todo разобраться, какой instance axios использовать
        return {
            message: 'Request was cancelled',
            isNetworkError: false,
            isCancelled: true,
            source: 'axios',
        }
    }

    if (isAxiosError(err)) {
        const ax = err
        const status = ax.response?.status
        // пытаемся вытащить код/сообщение из JSON тела
        const data = ax.response?.data
        const code =
            (typeof data?.code === 'string' && data.code) ||
            (typeof data?.error === 'string' && data.error) ||
            undefined

        const message =
            (typeof data?.message === 'string' && data.message) ||
            (typeof data?.error_description === 'string' && data.error_description) ||
            ax.message ||
            'Request failed'

        const isNetworkError = !!(
            ax.code === 'ECONNABORTED' || // таймаут
            (!ax.response && ax.request)  // сеть/CORS
        )

        return {
            status,
            code,
            message,
            details: status ? data : undefined, // в детали кладём тело ответа, если оно от сервера
            isNetworkError,
            isCancelled: false,
            source: 'axios',
        }
    }

    // Не axios-ошибка
    return {
        message: err instanceof Error ? err.message : 'Unknown error',
        isNetworkError: false,
        isCancelled: false,
        source: 'axios',
    }
}

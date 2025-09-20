import {type AxiosInstance,} from 'axios'

/** Унифицированная ошибка для всего фронта */
export type HttpError = {
    /** HTTP-код если был ответ сервера */
    status?: number
    /** Код из тела ответа/бэка (если есть) */
    code?: string
    /** Человекочитаемое сообщение */
    message: string
    /** Оригинальные детали (безопасные) */
    details?: unknown
    /** Не было сети / CORS / таймаут */
    isNetworkError: boolean
    /** Запрос отменён */
    isCancelled: boolean
    /** Отладочная метка, чтобы понять, что это пришло из axios */
    source: 'axios'
}


export type HttpClientOptions = {
    /** Готовый инстанс axios (DI). Если не передать — создадим дефолтный. */
    axios?: AxiosInstance
    /** Базовый URL, если создаём дефолтный инстанс */
    baseURL?: string
    /** Таймаут по умолчанию, мс */
    timeoutMs?: number
    /** Заголовки по умолчанию */
    headers?: Record<string, string>
}



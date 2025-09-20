import {HttpClientOptions} from "./httpClient.type";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {normalizeError} from "./normalizeError";

/** Лёгкая обёртка над axios: единый тип ошибок, sugar-методы и настройка заголовков */
export class HttpClient {
    private readonly ax: AxiosInstance

    constructor(opts: HttpClientOptions = {}) {
        this.ax =
            opts.axios ??
            axios.create({
                baseURL: opts.baseURL ?? '',
                timeout: opts.timeoutMs ?? 15000,
                headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
                withCredentials: false,
            })
    }


    private async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
        try {
            const res: AxiosResponse<T> = await this.ax.request<T>(config)
            return res.data
        } catch (e) {
            throw normalizeError(e)
        }
    }

    // Sugar-методы
    get<T = unknown>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'GET', url, ...(config ?? {}) })
    }
    delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'DELETE', url, ...(config ?? {}) })
    }
    post<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'POST', url, data: body, ...(config ?? {}) })
    }
    put<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'PUT', url, data: body, ...(config ?? {}) })
    }
    patch<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'PATCH', url, data: body, ...(config ?? {}) })
    }

    /** Доступ к исходному axios, если вдруг нужна тонкая настройка */
    get rawAxiosInstance(): AxiosInstance {
        return this.ax
    }
}

/** Дефолтный экземпляр на проект (можно не использовать, если DI везде) */
export const http = new HttpClient()

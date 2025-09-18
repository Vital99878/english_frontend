import {AxiosInstance} from "axios";

export type ClozeArticleProps = {
    slug: string
    /** Шаблон с пропусками, например: "He is {{a1}} engineer. I go to {{a2|∅}} work." */
    template: string
    /** Подписи для доступности (опционально) */
    ariaLabels?: Record<string, string>
    /** Начальные значения полей (опционально) */
    initialValues?: Record<string, string>
    /** Если указан — проверяем локально (без бэка) */
    localAnswers?: AnswersMap
    /** Включить автопроверку (debounce 400мс через RxJS) */
    autoCheck?: boolean
    /** Кастомный axios instance (опционально) */
    axiosInstance?: AxiosInstance
    /** Сборка URL для бэка (по умолчанию /api/exercises/:slug/check) */
    buildCheckUrl?: (slug: string) => string
    /** Колбэк, если нужно перехватить результат */
    onChecked?: (result: CheckResult) => void
}

type TextToken = { kind: 'text'; text: string }
export type FieldToken = { kind: 'field'; id: string; placeholder?: string }
export type Token = TextToken | FieldToken

export type FieldResult = { status: 'ok' | 'wrong' | 'partial'; message?: string }
export type CheckResult = {
    overall: 'correct' | 'partial' | 'wrong'
    fieldResults: Record<string, FieldResult>
}

export type AnswersMap = Record<string, string[]> // local check (опционально)

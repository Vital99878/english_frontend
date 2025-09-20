
export type ClozeArticleProps = {
    slug: string
    /** Подписи для доступности (опционально) */
    ariaLabels?: Record<string, string>
}

type TextToken = { kind: 'text'; text: string }
export type FieldToken = { kind: 'field'; id: string; placeholder?: string }
export type Token = TextToken | FieldToken

export type FieldResult = { status: 'ok' | 'wrong' | 'partial'; message?: string }
export type CheckResult = {
    overall: 'correct' | 'partial' | 'wrong'
    fieldResults: Record<string, FieldResult>
}


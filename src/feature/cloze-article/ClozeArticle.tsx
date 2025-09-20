import React from 'react'
import axios, { AxiosInstance } from 'axios'
import { Subject } from 'rxjs'
import { useMutation } from '@tanstack/react-query'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { AutoInput } from './ui/AutoInput'
import { FieldToken, CheckResult } from 'src/feature/cloze-article/model/types'
import { parseTemplate, tone } from './lib'
import { useExerciseMeta } from "./model/useExerciseMeta"

export type ClozeArticleProps = {
    slug: string
    autoCheck?: boolean
    initialValues?: Record<string, string>
    axiosInstance?: AxiosInstance
    buildMetaUrl?: (slug: string) => string
    buildCheckUrl?: (slug: string) => string
    onChecked?: (result: CheckResult) => void
}

export function ClozeArticle({
                                 slug,
                                 autoCheck,
                                 initialValues,
                                 axiosInstance,
                                 buildMetaUrl = (s) => `/api/exercises/${s}`,
                                 buildCheckUrl = (s) => `/api/exercises/${s}/check`,
                                 onChecked,
                             }: ClozeArticleProps) {
    const http = axiosInstance ?? axios.create()

    // (1) Всегда вызываем хук загрузки
    const metaQuery = useExerciseMeta(slug, { axiosInstance: http, buildMetaUrl })

    // Подготовим безопасные данные, даже если еще грузится
    const template = metaQuery.data?.template ?? ''
    const ariaLabels = metaQuery.data?.aria ?? {}

    // (2) Всегда вызываем мемо/стейт/эффекты
    const tokens = React.useMemo(() => (template ? parseTemplate(template) : []), [template])
    const fieldIds = React.useMemo(
        () => tokens.filter((t) => t.kind === 'field').map((t) => (t as FieldToken).id),
        [tokens],
    )

    const [values, setValues] = React.useState<Record<string, string>>({})
    // Инициализируем значения, когда список полей готов (или изменился)
    React.useEffect(() => {
        if (!fieldIds.length) return
        const v: Record<string, string> = {}
        for (const id of fieldIds) v[id] = initialValues?.[id] ?? ''
        setValues(v)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldIds.join('|')])

    const [lastResult, setLastResult] = React.useState<CheckResult | null>(null)

    const mutation = useMutation({
        mutationFn: async (fields: Record<string, string>): Promise<CheckResult> => {
            const { data } = await http.post<CheckResult>(buildCheckUrl(slug), { fields })
            return data
        },
        onSuccess: (res) => {
            setLastResult(res)
            onChecked?.(res)
        },
    })

    // RxJS автопроверка — создаем стрим один раз
    const values$ = React.useMemo(() => new Subject<Record<string, string>>(), [])
    React.useEffect(() => {
        if (!autoCheck) return
        const sub = values$
            .pipe(debounceTime(400), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
            .subscribe((v) => mutation.mutate(v))
        return () => sub.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCheck])

    function setValue(id: string, next: string) {
        setValues((prev) => {
            const v = { ...prev, [id]: next }
            if (autoCheck) values$.next(v)
            return v
        })
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        mutation.mutate(values)
    }

    const fieldStatus = (id: string) => lastResult?.fieldResults?.[id]?.status

    // (3) Теперь можно условно рендерить — порядок хуков уже фиксирован
    if (metaQuery.isLoading) return <div>Loading…</div>
    if (metaQuery.isError || !template) return <div>Exercise not found.</div>

    return (
        <form onSubmit={submit} style={{ maxWidth: 880, margin: '0 auto', padding: 16 }}>
            <p style={{ lineHeight: 2, fontSize: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 0' }}>
                {tokens.map((t, i) => {
                    if (t.kind === 'text') return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{t.text}</span>
                    const f = t as FieldToken
                    const aria = ariaLabels[f.id] ?? `Field: ${f.id}`
                    return (
                        <AutoInput
                            key={i}
                            id={f.id}
                            value={values[f.id] ?? ''}
                            onChange={(v) => setValue(f.id, v)}
                            placeholder={f.placeholder}
                            ariaLabel={aria}
                            toneClass={tone(fieldStatus(f.id))}
                        />
                    )
                })}
            </p>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="submit" disabled={mutation.isPending} style={{ padding: '8px 14px', borderRadius: 12, border: '1px solid #ddd', background: '#fff' }}>
                    {mutation.isPending ? 'Checking…' : 'Check'}
                </button>
                {lastResult && (
                    <span style={{ color: lastResult.overall === 'correct' ? '#16a34a' : lastResult.overall === 'partial' ? '#ca8a04' : '#dc2626' }}>
            Result: {lastResult.overall}
          </span>
                )}
            </div>

            {lastResult && (
                <ul style={{ marginTop: 8, fontSize: 14 }}>
                    {Object.entries(lastResult.fieldResults).map(([id, r]) =>
                        r.message ? (
                            <li key={id} style={{ color: r.status === 'ok' ? '#16a34a' : r.status === 'wrong' ? '#dc2626' : '#ca8a04' }}>
                                [{id}] {r.message}
                            </li>
                        ) : null,
                    )}
                </ul>
            )}

            <style>{`
        .ok input { border-bottom-color: #16a34a !important; }
        .err input { border-bottom-color: #dc2626 !important; }
      `}</style>
        </form>
    )
}

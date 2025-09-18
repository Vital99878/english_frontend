import React from 'react'
import axios from 'axios'
import {Subject} from 'rxjs'
import {useMutation, type UseMutationResult} from '@tanstack/react-query'
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'
import {AutoInput} from "./ui/AutoInput";
import {ClozeArticleProps, CheckResult, FieldResult, FieldToken} from "src/feature/cloze-article/model/types";
import {norm, parseTemplate, tone} from "./lib";

export function ClozeArticle({
                                 slug,
                                 template,
                                 ariaLabels,
                                 initialValues,
                                 localAnswers,
                                 autoCheck,
                                 axiosInstance,
                                 buildCheckUrl = (s) => `/api/exercises/${s}/check`,
                                 onChecked,
                             }: ClozeArticleProps) {
    const tokens = React.useMemo(() => parseTemplate(template), [template])
    const fieldIds = React.useMemo(() => tokens.filter(t => t.kind === 'field').map(t => (t as FieldToken).id), [tokens])

    const [values, setValues] = React.useState<Record<string, string>>(() => {
        const v: Record<string, string> = {}
        for (const id of fieldIds) v[id] = initialValues?.[id] ?? ''
        return v
    })
    const [lastResult, setLastResult] = React.useState<CheckResult | null>(null)

    const http = axiosInstance ?? axios.create()

    // --- Проверка ответов (локально или через бек) ---
    async function check(valuesToCheck: Record<string, string>): Promise<CheckResult> {
        if (localAnswers) {
            let okCount = 0
            const fieldResults: Record<string, FieldResult> = {}
            for (const id of fieldIds) {
                const accepted = (localAnswers[id] ?? []).map(norm)
                const isOk = accepted.includes(norm(valuesToCheck[id] ?? ''))
                fieldResults[id] = isOk ? { status: 'ok' } : { status: 'wrong', message: (localAnswers[id] ?? []).join(' / ') || '—' }
                if (isOk) okCount++
            }
            const overall: CheckResult['overall'] =
                okCount === fieldIds.length ? 'correct' : okCount > 0 ? 'partial' : 'wrong'
            return { overall, fieldResults }
        }
        // Через бек
        const url = buildCheckUrl(slug)
        const { data } = await http.post<CheckResult>(url, { fields: valuesToCheck })
        return data
    }

    const mutation: UseMutationResult<CheckResult, unknown, Record<string, string>> = useMutation({
        mutationFn: check,
        onSuccess: (res) => {
            setLastResult(res)
            onChecked?.(res)
        },
    })

    // --- RxJS автопроверка (debounce 400мс) ---
    const values$ = React.useMemo(() => new Subject<Record<string, string>>(), [])
    React.useEffect(() => {
        if (!autoCheck) return
        const sub = values$
            .pipe(
                debounceTime(400),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            )
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


    return (
        <form onSubmit={submit} style={{ maxWidth: 880, margin: '0 auto', padding: 16 }}>
            <p style={{ lineHeight: 2, fontSize: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 0' }}>
                {tokens.map((t, i) => {
                    if (t.kind === 'text') return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{t.text}</span>
                    const f = t as FieldToken
                    const status = fieldStatus(f.id)
                    const aria = ariaLabels?.[f.id] ?? `Field: ${f.id}`
                    return (
                        <AutoInput
                            key={i}
                            id={f.id}
                            value={values[f.id] ?? ''}
                            onChange={(v) => setValue(f.id, v)}
                            placeholder={f.placeholder}
                            ariaLabel={aria}
                            toneClass={tone(status)}
                        />
                    )
                })}
            </p>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="submit" disabled={mutation.isPending} style={{ padding: '8px 14px', borderRadius: 12, border: '1px solid #ddd', background: '#fff' }}>
                    {mutation.isPending ? 'Checking…' : 'Check'}
                </button>
                {lastResult && (
                    <span
                        style={{
                            color:
                                lastResult.overall === 'correct' ? '#16a34a' :
                                    lastResult.overall === 'partial' ? '#ca8a04' : '#dc2626'
                        }}
                    >
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
                        ) : null
                    )}
                </ul>
            )}

            {/* маленькие утилитарные классы для цветного бордера (если хочешь Tailwind — легко заменить) */}
            <style>{`
        .ok input { border-bottom-color: #16a34a !important; }
        .err input { border-bottom-color: #dc2626 !important; }
      `}</style>
        </form>
    )
}

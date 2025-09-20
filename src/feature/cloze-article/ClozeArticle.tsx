import React from 'react'
import {AutoInput} from "./ui/AutoInput";
import {ClozeArticleProps, CheckResult, FieldToken} from "src/feature/cloze-article/model/types";
import {parseTemplate, tone} from "./lib";
import {useExerciseMeta} from "feature/cloze-article/model/useExerciseMeta";
import {useCheckExercise} from "feature/cloze-article/model/useCheckExercise";

export function ClozeArticle({
                                 slug,
                                 ariaLabels,
                                 initialValues,
                             }: ClozeArticleProps) {

    const exerciseMeta = useExerciseMeta(slug)
    const mutation = useCheckExercise(slug)

    const tokens = React.useMemo(() => {
        if (exerciseMeta.data?.payload?.text) {
            return parseTemplate(exerciseMeta.data.payload.text)
        } else return []

    }, [exerciseMeta.data])

    const fieldIds = React.useMemo(() => tokens.filter(t => t.kind === 'field').map(t => (t as FieldToken).id), [tokens])

    const [values, setValues] = React.useState<Record<string, string>>(() => {
        const v: Record<string, string> = {}
        for (const id of fieldIds) v[id] = initialValues?.[id] ?? ''
        return v
    })
    const [lastResult,] = React.useState<CheckResult | null>(null)


    function setValue(id: string, next: string) {
        setValues((prev) => {
            return {...prev, [id]: next}
        })
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        mutation.mutate(values)
    }

    const fieldStatus = (id: string) => lastResult?.fieldResults?.[id]?.status

    return (
        <form onSubmit={submit} style={{maxWidth: 880, margin: '0 auto', padding: 16}}>
            <p style={{
                lineHeight: 2,
                fontSize: 18,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px 0'
            }}>
                {tokens.map((t, i) => {
                    if (t.kind === 'text') return <span key={i} style={{whiteSpace: 'pre-wrap'}}>{t.text}</span>
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

            <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 12}}>
                <button type="submit" disabled={mutation.isPending}
                        style={{padding: '8px 14px', borderRadius: 12, border: '1px solid #ddd', background: '#fff'}}>
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
                <ul style={{marginTop: 8, fontSize: 14}}>
                    {Object.entries(lastResult.fieldResults).map(([id, r]) =>
                        r.message ? (
                            <li key={id}
                                style={{color: r.status === 'ok' ? '#16a34a' : r.status === 'wrong' ? '#dc2626' : '#ca8a04'}}>
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

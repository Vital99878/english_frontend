import React from 'react'
import {AutoInput} from "./ui/AutoInput";
import {ClozeArticleProps, FieldToken} from "src/feature/cloze-article/model/types";
import {parseTemplate, tone} from "./lib";
import {useExerciseMeta} from "feature/cloze-article/model/useExerciseMeta";
import {useCheckExercise} from "feature/cloze-article/model/useCheckExercise";

export function ClozeArticle({
                                 slug,
                                 ariaLabels,
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
        for (const id of fieldIds) v[id] = ''
        return v
    })

    React.useEffect(() => {
        setValues((prev) => {
            const next: Record<string, string> = {}
            for (const id of fieldIds) {
                next[id] = prev[id] ?? ''
            }
            return next
        })
    }, [fieldIds])


    function setValue(id: string, next: string) {
        setValues((prev) => {
            return {...prev, [id]: next}
        })
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        mutation.mutate(values)
    }

    const lastResult = mutation.data ?? null
    const fieldStatus = (id: string) => lastResult?.fieldResults?.[id]?.status

    return (
        <form
            onSubmit={submit}
            className="mx-auto mt-8 max-w-3xl space-y-5 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur"
        >
            <p className="flex flex-wrap items-center gap-x-1 gap-y-2 text-lg leading-8 text-slate-800">
                {tokens.map((t, i) => {
                    if (t.kind === 'text') return <span key={i} className="whitespace-pre-wrap ">{t.text}</span>
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

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {mutation.isPending ? 'Checking…' : 'Check'}
                </button>
            </div>
        </form>
    )
}

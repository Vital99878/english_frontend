import React from "react";
import useAutoWidth from "feature/cloze-article/ui/useAutoWidth";

export function AutoInput({
                              id,
                              value,
                              onChange,
                              placeholder,
                              toneClass,
                              ariaLabel,
                          }: {
    id: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    toneClass?: string
    ariaLabel?: string
}) {
    const {mirrorRef, widthPx} = useAutoWidth(value)
    return (
        <span className="relative inline-block align-baseline">
            <span
                ref={mirrorRef}
                className="pointer-events-none invisible absolute -left-[9999px] -top-[9999px] whitespace-pre"
                style={{
                    font: 'inherit',
                    letterSpacing: 'inherit',
                }}
                aria-hidden
            />
            <input
                id={id}
                name={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder ?? '…'}
                aria-label={ariaLabel}
                style={{
                    width: `${widthPx}px`,
                }}
                className={`mx-1 border-0 border-b-2 border-slate-300 bg-transparent px-1 pb-0.5 text-base text-slate-900 outline-none transition-colors focus:border-blue-500 ${toneClass ?? ''}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || (e).metaKey)) {
                        (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit()
                    }
                }}
            />
        </span>
    )
}

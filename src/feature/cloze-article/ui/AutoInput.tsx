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
        <span style={{position: 'relative', display: 'inline-block', verticalAlign: 'baseline'}}>
      <span
          ref={mirrorRef}
          style={{
              position: 'absolute',
              left: -9999,
              top: -9999,
              whiteSpace: 'pre',
              font: 'inherit',
              letterSpacing: 'inherit'
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
              margin: '0 4px',
              background: 'transparent',
              border: 0,
              borderBottom: '1px solid #9ca3af',
              outline: 'none',
          }}
          className={toneClass}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || (e).metaKey)) {
                  (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit()
              }
          }}
      />
    </span>
    )
}

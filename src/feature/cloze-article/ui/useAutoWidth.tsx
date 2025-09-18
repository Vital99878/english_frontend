import React from "react";

export default function useAutoWidth(value: string) {
    const mirrorRef = React.useRef<HTMLSpanElement | null>(null)
    const [w, setW] = React.useState(4)
    const measure = React.useCallback(() => {
        const el = mirrorRef.current
        if (!el) return
        el.textContent = value || ''
        setW(Math.ceil(el.offsetWidth) + 4)
    }, [value])
    React.useLayoutEffect(measure, [measure])
    React.useEffect(() => {
        const r = () => measure()
        window.addEventListener('resize', r)
        return () => window.removeEventListener('resize', r)
    }, [measure])
    return {mirrorRef, widthPx: w}
}

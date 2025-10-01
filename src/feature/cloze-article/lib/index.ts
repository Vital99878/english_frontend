import {Token} from "feature/cloze-article/model/types";
const RE = /\{\{([^}]+)}}/g

export const norm = (s: string) => s.trim().toLowerCase()

export function parseTemplate(template: string): Token[] {
    const tokens: Token[] = []
    let lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = RE.exec(template))) {
        const start = m.index
        const end = RE.lastIndex
        if (start > lastIndex) tokens.push({kind: 'text', text: template.slice(lastIndex, start)})
        const raw = m[1].trim()
        const [idPart, ph] = raw.split('|')
        tokens.push({kind: 'field', id: (idPart || '').trim(), placeholder: ph?.trim()})
        lastIndex = end
    }
    if (lastIndex < template.length) tokens.push({kind: 'text', text: template.slice(lastIndex)})
    return tokens
}

export const tone = (status?: string) => {
    switch (status) {
    case 'ok':
        return 'border-emerald-500 text-emerald-700 focus:border-emerald-600';
    case 'wrong':
        return 'border-rose-500 text-rose-600 focus:border-rose-500';
    case 'partial':
        return 'border-amber-500 text-amber-600 focus:border-amber-500';
    default:
        return ''
    }
}

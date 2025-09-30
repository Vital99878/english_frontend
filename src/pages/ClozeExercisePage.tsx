import * as React from 'react'
import { createRoute } from '@tanstack/react-router'
import {ClozeArticle} from "feature/cloze-article/ClozeArticle";

// (необязательно экспортить сам объект маршрута, но удобно для useParams)
export const exerciseRoute = createRoute({
    getParentRoute: () => null as any, // заглушка, роут подключаем в router.tsx
    path: '/$slug',
})

export default function ClozeExercisePage() {
    // Надёжный способ получить параметры именно этого роута
    const { slug } = exerciseRoute.useParams()
    return <ClozeArticle slug={slug} />
}

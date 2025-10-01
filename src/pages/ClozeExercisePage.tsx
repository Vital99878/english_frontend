import * as React from 'react'
import { useParams } from '@tanstack/react-router'
import {ClozeArticle} from "feature/cloze-article/ClozeArticle";


export default function ClozeExercisePage() {
    // Надёжный способ получить параметры именно этого роута
    const { slug } = useParams({ from: '/exercises/$slug' as const })
    return <ClozeArticle slug={slug} />
}

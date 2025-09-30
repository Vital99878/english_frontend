import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {ServicesProvider} from "@/app/providers/ServicesProvider";

export default function IndexPage() {
    return (
        <ServicesProvider>
        <div>
            <h1>Home</h1>
            <p>
                Перейти к упражнению:{' '}
                <Link to="/exercises/$slug" params={{ slug: '37455260-afc2-4d0a-a0c7-d83709c7beb5' }}>
                    articles-basics-1
                </Link>
            </p>
        </div>
        </ServicesProvider>

    )
}

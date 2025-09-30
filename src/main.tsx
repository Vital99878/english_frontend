// src/main.tsx
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {AppRouter} from '@/app/router'
import {ServicesProvider} from "@/app/providers/ServicesProvider";

const qc = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={qc}>
        <ServicesProvider>
            <AppRouter/>
        </ServicesProvider>
    </QueryClientProvider>
)

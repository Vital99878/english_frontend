import React, {createContext, useMemo, useContext} from 'react'
import {createServices, type Services} from '@/app/services'

const ServicesCtx = createContext<Services | null>(null)

export const ServicesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const services = useMemo(() => createServices(), [])
    return <ServicesCtx.Provider value={services}>{children}</ServicesCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServices(): Services {
    const ctx = useContext(ServicesCtx)
    if (!ctx) throw new Error('useServices must be used within ServicesProvider')
    return ctx
}

import * as React from 'react'
import {
    createRootRoute,
    createRoute,
    createRouter,
    RouterProvider,
    Outlet,
} from '@tanstack/react-router'
import IndexPage from '@/pages/IndexPage'
import ClozeExercisePage, { exerciseRoute } from '@/pages/ClozeExercisePage'

// Корневой лейаут
const Root = () => (
    <div style={{ padding: 16 }}>
        <Outlet />
    </div>
)

const rootRoute = createRootRoute({ component: Root })

// /
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: IndexPage,
})

// /exercises/:slug
const exercisesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/exercises/$slug',
    component: ClozeExercisePage,
})

const routeTree = rootRoute.addChildren([indexRoute, exercisesRoute])

export const router = createRouter({ routeTree })

// Типизация router для хуков и <Link>
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Провайдер
export function AppRouter() {
    return <RouterProvider router={router} />
}

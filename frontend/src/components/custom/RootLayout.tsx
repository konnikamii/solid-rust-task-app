import { A, RouteSectionProps, useLocation } from '@solidjs/router'
import { Show, ErrorBoundary, Suspense, createEffect, createSignal } from 'solid-js'
import TopNavbar from '@Components/custom/TopNavbar'
import { QueryClientProvider } from '@tanstack/solid-query'
import { queryClient } from '@Src/lib/api/client'
import { Toaster } from 'solid-toast'
import Header from '@Components/custom/Header'
import SideNavbar from '@Components/custom/SideNavbar'
import CookieConsent from '@Components/custom/CookieConsent'
import { getMe } from '@Src/lib/api/users/users'
import { logout } from '@Src/lib/api/auth/auth'
import { ApiError } from '@Src/lib/utils/fetch'

const REDIRECTABLE_PATHS = new Set(['/', '/login', '/register', '/contact'])
let authCheckToken = 0

export default function RootLayout(props: RouteSectionProps) {
  const location = useLocation()
  const [authChecked, setAuthChecked] = createSignal(false)
  const isAppRoute = () => location.pathname.startsWith('/app')

  createEffect(async () => {
    const pathname = location.pathname
    const pathIsAppRoute = pathname.startsWith('/app')
    const token = ++authCheckToken

    try {
      const user = await getMe()
      if (token !== authCheckToken) return

      queryClient.setQueryData(['user'], user)

      if (REDIRECTABLE_PATHS.has(pathname) && typeof window !== 'undefined') {
        window.location.href = '/app/dashboard'
        return
      }

      setAuthChecked(true)
    } catch (error) {
      if (token !== authCheckToken) return

      queryClient.removeQueries({ queryKey: ['user'] })

      if (pathIsAppRoute) {
        try {
          await logout()
        } catch {
          // Ignore logout failures and continue redirecting to login.
        }

        if (typeof window !== 'undefined') {
          window.location.href = '/login'
          return
        }
      }

      if (error instanceof ApiError && error.status === 401) {
        setAuthChecked(true)
        return
      }

      setAuthChecked(true)
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <div class='min-h-screen bg-background text-foreground'>
        <Show when={authChecked() && !isAppRoute()}>
          <TopNavbar />
          <ErrorBoundary
            fallback={(error) => (
              <div>
                <p>Something went wrong: {error.message}</p>
                <A href='/'>To home</A>
              </div>
            )}
          >
            <Suspense>{props.children}</Suspense>
          </ErrorBoundary>
        </Show>

        <Show when={authChecked() && isAppRoute()}>
          <div class='flex min-h-screen'>
            <SideNavbar />

            <div class='grow'>
              <Header />
              <div class='h-[calc(100vh-70px)] overflow-y-auto pb-10' style='scrollbar-width: thin;'>
                <ErrorBoundary
                  fallback={(error) => (
                    <div>
                      <p>Something went wrong: {error.message}</p>
                      <A href='/app/dashboard'>To dashboard</A>
                      <div>Go back</div>
                    </div>
                  )}
                >
                  <Suspense>{props.children}</Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </Show>

        <Toaster position='bottom-right' toastOptions={{ duration: 1200 }} />
        <CookieConsent />
      </div>
    </QueryClientProvider>
  )
}

import { ErrorBoundary, JSXElement, Show, Suspense } from 'solid-js'
import { A, Router, useLocation, type RouteSectionProps } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import TopNavbar from '@Components/TopNavbar'
import './app.css'

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  )
}

const RootLayout = (props: RouteSectionProps) => {
  const location = useLocation()
  const isAppRoute = () => location.pathname.startsWith('/app')

  return (
    <div class='bg-background text-foreground min-h-screen'>
      <Show when={!isAppRoute()}>
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

      <Show when={isAppRoute()}>
        <div class='flex min-h-screen'>
          {/* <SideNavbar /> */}

          <div class='grow'>
            {/* <AppHeader /> */}
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
    </div>
  )
}

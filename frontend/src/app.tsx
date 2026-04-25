import { ErrorBoundary, JSXElement, Show, Suspense } from 'solid-js'
import { A, Router, useLocation, type RouteSectionProps } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import TopNavbar from '@Src/components/custom/TopNavbar'
import './app.css'
import RootLayout from '@Components/custom/RootLayout'

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  )
}

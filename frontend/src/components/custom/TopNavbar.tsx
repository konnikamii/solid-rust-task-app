import { A, useLocation } from '@solidjs/router'
import TaskifyLogo from '@Components/svgs/TaskifyLogo'
import ThemeToggler from './ThemeToggler'

export default function TopNavbar() {
  const location = useLocation()
  const isActive = (path: string) => path === location.pathname
  return (
    <header class='sticky top-0 z-50 border-b border-border bg-background p-2 shadow-sm shadow-secondary backdrop-blur'>
      <div class='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <A href={'/'} draggable='false' class='group flex items-center gap-2 text-lg font-semibold text-foreground'>
          <TaskifyLogo width={40} height={40} />
          <span class='text-2xl'>Taskify</span>
        </A>
        <div class='flex items-center gap-3'>
          <nav class='flex items-center gap-2 text-sm text-muted-foreground'>
            <A href='/' class='rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground'>
              Home
            </A>
            <A href='/contact' class='rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground'>
              Contact
            </A>
            <A href='/login' class='rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground'>
              Login
            </A>
            <A href='/register' class='rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground'>
              Register
            </A>
          </nav>
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}

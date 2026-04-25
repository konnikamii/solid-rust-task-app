import { A, useLocation } from '@solidjs/router'
import TaskifyLogo from '@Components/svgs/TaskifyLogo'
import ThemeToggler from './ThemeToggler'

export default function TopNavbar() {
  const location = useLocation()
  const isActive = (path: string) => path === location.pathname
  return (
    <header class='border-border bg-background shadow-secondary sticky top-0 z-50 border-b shadow-sm backdrop-blur'>
      <div class='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <A href={'/'} draggable='false' class='group text-foreground flex items-center gap-2 text-lg font-semibold'>
          <TaskifyLogo width={40} height={40} />
          <span class='text-2xl'>Taskify</span>
        </A>
        {/* <div class="flex items-center gap-3">
      <nav class="flex items-center gap-2 text-sm text-muted-foreground">
        {#each navItems as item (item.href)}
          <a href={resolve(item.href)} class="rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground">
            {item.label}
          </a>
        {/each}
      </nav>

      </div> */}
        <div class='flex items-center gap-3'>
          <nav class='text-muted-foreground flex items-center gap-2 text-sm'>
            <A href='/' class='hover:bg-muted hover:text-foreground rounded-md px-3 py-2 transition'>
              Home
            </A>
            <A href='/contact' class='hover:bg-muted hover:text-foreground rounded-md px-3 py-2 transition'>
              Contact
            </A>
            <A href='/login' class='hover:bg-muted hover:text-foreground rounded-md px-3 py-2 transition'>
              Login
            </A>
            <A href='/register' class='hover:bg-muted hover:text-foreground rounded-md px-3 py-2 transition'>
              Register
            </A>
          </nav>
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}

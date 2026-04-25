import { A, useLocation } from '@solidjs/router'
import TaskifyLogo from '@Components/svgs/TaskifyLogo'
import { useLogout } from '@Src/lib/api/auth/auth'
import { createSignal, For } from 'solid-js'
import { ChevronLeft, LayoutDashboard, ListTodo, LogOut, Settings } from 'lucide-solid'

export const navItems = [
  {
    href: '/app/dashboard',
    label: 'Dashboard',
    message: 'Welcome to your dashboard! Here you can see a quick overview of completed, upcoming and urgent tasks.',
    icon: <LayoutDashboard />,
  },
  {
    href: '/app/tasks',
    label: 'Tasks',
    message: 'Here you can see all your tasks, filter them and create new ones.',
    icon: <ListTodo />,
  },
  {
    href: '/app/settings',
    label: 'Settings',
    message: 'Manage your account settings, preferences and more.',
    icon: <Settings />,
  },
]

export default function SideNavbar() {
  const location = useLocation()

  const [navbarOpen, setNavbarOpen] = createSignal(true)

  const logoutMutation = useLogout()

  return (
    <aside
      class={`flex h-screen flex-col border-r border-border transition-all duration-150 ${navbarOpen() ? 'w-[230px]' : 'w-[80px]'}`}
    >
      <div class='relative flex h-[70px] items-center justify-center overflow-visible border-b border-border p-4'>
        <A
          href={'/app/dashboard'}
          draggable='false'
          class={`group flex items-center text-lg font-semibold text-foreground transition-[gap] duration-150 ${navbarOpen() ? 'gap-2' : 'gap-0'}`}
        >
          <TaskifyLogo width={40} height={40} />
          <span
            class={`overflow-hidden text-2xl whitespace-nowrap transition-[max-width,opacity] duration-150 ${navbarOpen() ? 'max-w-28 opacity-100' : 'max-w-0 opacity-0'}`}
          >
            Taskify
          </span>
        </A>
        <div class='absolute top-1/2 right-0 z-[60] translate-x-1/2 -translate-y-1/2'>
          <ChevronLeft
            onclick={() => setNavbarOpen((prev) => !prev)}
            class={`size-5 cursor-pointer rounded-full bg-accent-foreground text-white transition duration-150 hover:opacity-80 dark:text-black ${navbarOpen() ? '' : 'rotate-180'}`}
          />
        </div>
      </div>
      <div class='flex grow flex-col gap-2 p-4'>
        <For each={navItems}>
          {(item) => (
            <a
              href={item.href}
              aria-label={item.label}
              class={`group flex items-center rounded-md px-3 py-2 transition-all duration-150 ${navbarOpen() ? 'w-full gap-2 hover:opacity-80' : 'w-[44px] gap-0 hover:w-fit hover:gap-2'} ${location.pathname.startsWith(item.href) ? 'bg-primary' : 'bg-secondary'}`}
            >
              {item.icon}
              <span
                class={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 ${navbarOpen() ? 'max-w-28 opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-28 group-hover:opacity-100'}`}
              >
                {item.label}
              </span>
            </a>
          )}
        </For>
      </div>
      <div class='flex h-[70px] flex-col border-t border-border p-4'>
        <button
          type='button'
          class={`group flex cursor-pointer items-center rounded-md bg-secondary px-3 py-2 transition-all duration-150 ${navbarOpen() ? 'w-full gap-2 hover:opacity-80' : 'w-[44px] gap-0 hover:w-fit hover:gap-2'}`}
          onclick={() => logoutMutation.mutate()}
        >
          <LogOut />
          <span
            class={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 ${navbarOpen() ? 'max-w-28 opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-28 group-hover:opacity-100'}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}

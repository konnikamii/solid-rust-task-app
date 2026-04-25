import { A, useLocation } from '@solidjs/router'

export default function SideNavbar() {
  const location = useLocation()
  const isActive = (path: string) => path === location.pathname

  // let navbarOpen = $state(true)

  // const [navbarOpen] = State

  // const logoutMutation = useLogout()
  const navItems = [
    {
      href: '/app/dashboard',
      label: 'Dashboard',
      message: 'Welcome to your dashboard! Here you can see a quick overview of completed, upcoming and urgent tasks.',
      // icon: LayoutDashboardIcon,
    },
    {
      href: '/app/tasks',
      label: 'Tasks',
      message: 'Here you can see all your tasks, filter them and create new ones.',
      // icon: PackagePlus,
    },
    {
      href: '/app/settings',
      label: 'Settings',
      message: 'Manage your account settings, preferences and more.',
      // icon: Settings2,
    },
  ]

  return (
    <header class='border-border bg-background shadow-secondary sticky top-0 z-50 border-b shadow-sm backdrop-blur'>
      <ul class='container flex items-center p-3 text-gray-200'>
        <li
          class={`mx-1.5 border-b-2 sm:mx-6 ${
            isActive('/') ? 'border-sky-600' : 'border-transparent hover:border-sky-600'
          }`}
        >
          <A href='/'>Home</A>
        </li>
        <li
          class={`mx-1.5 border-b-2 sm:mx-6 ${
            isActive('/') ? 'border-sky-600' : 'border-transparent hover:border-sky-600'
          } `}
        >
          <A href='/about'>About</A>
        </li>
        <li
          class={`mx-1.5 border-b-2 sm:mx-6 ${
            isActive('/') ? 'border-sky-600' : 'border-transparent hover:border-sky-600'
          } `}
        >
          <A href='/about'>About</A>
        </li>
        <li
          class={`mx-1.5 border-b-2 sm:mx-6 ${
            isActive('/') ? 'border-sky-600' : 'border-transparent hover:border-sky-600'
          } `}
        >
          <A href='/about'>About</A>
        </li>
      </ul>
    </header>
  )
}

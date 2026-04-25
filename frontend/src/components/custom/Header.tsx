import { useLocation } from '@solidjs/router'
import ThemeToggler from '@Components/custom/ThemeToggler'
import { navItems } from '@Components/custom/SideNavbar'

export default function Header() {
  const location = useLocation()
  return (
    <header class='sticky top-0 z-50 h-[70px] border-b border-border bg-background shadow-sm shadow-secondary backdrop-blur'>
      <div class='flex h-full items-center justify-between px-12'>
        <div>{navItems.find((e) => e.href === location.pathname)?.message}</div>
        <div class='flex items-center gap-3'>
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}

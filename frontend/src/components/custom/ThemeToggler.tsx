import { createSignal, onMount } from 'solid-js'
import ThemeToggleDark from '@Components/svgs/ThemeToggleDark'
import ThemeToggleLight from '@Components/svgs/ThemeToggleLight'

const THEME_STORAGE_KEY = 'theme'

export default function ThemeToggler() {
  const [isDark, setIsDark] = createSignal(true)
  const [initialized, setInitialized] = createSignal(false)

  function applyTheme(dark: boolean) {
    if (typeof document === 'undefined' || !document.body) return
    document.body.classList.toggle('dark', dark)
    document.body.style.colorScheme = dark ? 'dark' : 'light'
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
  }

  function initializeTheme() {
    if (typeof window === 'undefined' || initialized()) return

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const dark = savedTheme ? savedTheme === 'dark' : true
    setIsDark(dark)
    setInitialized(true)
    applyTheme(dark)
  }

  function toggleTheme() {
    const dark = !isDark()
    setIsDark(dark)
    applyTheme(dark)
  }

  onMount(() => {
    initializeTheme()
  })

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      aria-pressed={isDark()}
      class={`relative h-6 w-12 cursor-pointer rounded-full border border-gray-400 bg-gray-400 px-[6px] py-[3px] shadow-inner shadow-gray-700 transition-all`}
      onClick={toggleTheme}
    >
      <ThemeToggleLight
        class={`absolute left-1 size-4 translate-x-0 -translate-y-1/2 rotate-[-360deg] rounded-full bg-white opacity-100 transition-all duration-300 dark:translate-x-6 dark:rotate-0 dark:opacity-0`}
        color='oklch(79.5% 0.184 86.047)'
      />
      <ThemeToggleDark
        class={`absolute left-1 size-4 translate-x-0 -translate-y-1/2 rotate-[-360deg] rounded-full bg-white fill-black opacity-0 transition-all duration-300 dark:translate-x-6 dark:rotate-0 dark:opacity-100`}
      />
    </button>
  )
}

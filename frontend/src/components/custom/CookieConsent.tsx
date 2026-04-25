import { createSignal, onMount, Show } from 'solid-js'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentChoice = 'accepted' | 'declined'

function setConsentChoice(choice: ConsentChoice) {
  if (typeof window === 'undefined') return

  localStorage.setItem(COOKIE_CONSENT_KEY, choice)
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: choice }))
}

function initAnalyticsIfConsented() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent('analytics-consent-granted'))
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = createSignal(false)

  onMount(() => {
    const existingChoice = localStorage.getItem(COOKIE_CONSENT_KEY)
    setIsVisible(existingChoice !== 'accepted' && existingChoice !== 'declined')
  })

  const acceptCookies = () => {
    setConsentChoice('accepted')
    initAnalyticsIfConsented()
    setIsVisible(false)
  }

  const declineCookies = () => {
    setConsentChoice('declined')
    setIsVisible(false)
  }

  return (
    <Show when={isVisible()}>
      <section
        class='fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-base-300/70 bg-base-100/95 p-4 text-base-content shadow-2xl backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md'
        aria-live='polite'
        aria-label='Cookie consent'
      >
        <h2 class='text-base font-semibold'>Cookie preferences</h2>
        <p class='mt-2 text-sm text-base-content/60'>
          We use optional analytics cookies to understand traffic and improve the app. You can accept or decline anytime
          by clearing your browser storage.
        </p>
        <div class='mt-4 flex gap-2'>
          <button class='btn rounded-md px-3 btn-sm btn-primary' type='button' onClick={acceptCookies}>
            Accept
          </button>
          <button class='btn rounded-md px-3 btn-outline btn-sm' type='button' onClick={declineCookies}>
            Decline
          </button>
        </div>
      </section>
    </Show>
  )
}

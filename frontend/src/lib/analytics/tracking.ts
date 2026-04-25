const PUBLIC_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const PUBLIC_SIMPLE_ANALYTICS_DOMAIN = import.meta.env.VITE_SIMPLE_ANALYTICS_DOMAIN
const PUBLIC_SIMPLE_ANALYTICS_SCRIPT_URL = import.meta.env.VITE_SIMPLE_ANALYTICS_SCRIPT_URL

const CONSENT_STORAGE_KEY = 'cookie-consent'
const GA_SCRIPT_ID = 'ga-tracking-script'
const SA_SCRIPT_ID = 'simple-analytics-script'

type ConsentChoice = 'accepted' | 'declined'
type DataLayerEntry = [string, ...unknown[]]

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[]
    gtag?: (...args: unknown[]) => void
    sa_event?: (eventName: string) => void
  }
}

let analyticsInitialized = false
let trackedPath = ''

function getSimpleAnalyticsScriptUrl(): string {
  if (PUBLIC_SIMPLE_ANALYTICS_SCRIPT_URL) {
    return PUBLIC_SIMPLE_ANALYTICS_SCRIPT_URL
  }

  return 'https://scripts.simpleanalyticscdn.com/latest.js'
}

function initGoogleAnalytics(): void {
  if (!PUBLIC_GA_MEASUREMENT_ID) {
    return
  }

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = GA_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args as DataLayerEntry)
    }
  }

  window.gtag('js', new Date())
  window.gtag('config', PUBLIC_GA_MEASUREMENT_ID, { send_page_view: false })
}

function initSimpleAnalytics(): void {
  if (!PUBLIC_SIMPLE_ANALYTICS_DOMAIN) {
    return
  }

  if (document.getElementById(SA_SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')
  script.id = SA_SCRIPT_ID
  script.defer = true
  script.src = getSimpleAnalyticsScriptUrl()
  script.dataset.hostname = PUBLIC_SIMPLE_ANALYTICS_DOMAIN
  document.head.appendChild(script)
}

export function getConsentChoice(): ConsentChoice | null {
  if (typeof window === 'undefined') {
    return null
  }

  const choice = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (choice === 'accepted' || choice === 'declined') {
    return choice
  }

  return null
}

export function setConsentChoice(choice: ConsentChoice): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(CONSENT_STORAGE_KEY, choice)
}

export function resetTrackedPath(): void {
  trackedPath = ''
}

export function initAnalyticsIfConsented(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (getConsentChoice() !== 'accepted') {
    analyticsInitialized = false
    return
  }

  if (analyticsInitialized) {
    return
  }

  initGoogleAnalytics()
  initSimpleAnalytics()
  analyticsInitialized = true
}

export function trackPageView(url: URL): void {
  if (typeof window === 'undefined' || getConsentChoice() !== 'accepted') {
    return
  }

  initAnalyticsIfConsented()

  const path = `${url.pathname}${url.search}`
  if (path === trackedPath) {
    return
  }

  trackedPath = path

  if (window.gtag && PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: url.href,
      page_title: document.title,
      send_to: PUBLIC_GA_MEASUREMENT_ID,
    })
  }

  if (window.sa_event && PUBLIC_SIMPLE_ANALYTICS_DOMAIN) {
    window.sa_event('pageview')
  }
}

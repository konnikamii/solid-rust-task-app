import { createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

export type TourStep = {
  element?: string
  title: string
  message: string
}

type TourProps = {
  open: boolean
  steps: TourStep[]
  onClose: () => void
}

const PANEL_WIDTH = 360

export default function Tour(props: TourProps) {
  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [targetRect, setTargetRect] = createSignal<DOMRect | null>(null)
  const [viewport, setViewport] = createSignal({ width: 1280, height: 720 })

  const currentStep = createMemo(() => props.steps[currentIndex()] ?? null)
  const isLastStep = createMemo(() => currentIndex() === props.steps.length - 1)

  const syncTargetRect = () => {
    const step = currentStep()
    if (!props.open || !step?.element) {
      setTargetRect(null)
      return
    }

    const target = document.querySelector(step.element)
    if (!(target instanceof HTMLElement)) {
      setTargetRect(null)
      return
    }

    setTargetRect(target.getBoundingClientRect())
  }

  const scrollCurrentStepIntoView = () => {
    const step = currentStep()
    if (!props.open || !step?.element) return

    const target = document.querySelector(step.element)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

  createEffect(() => {
    if (!props.open) return
    setCurrentIndex(0)
  })

  createEffect(() => {
    if (!props.open) {
      setTargetRect(null)
      return
    }

    setViewport({ width: window.innerWidth, height: window.innerHeight })
    scrollCurrentStepIntoView()
    syncTargetRect()

    const handleLayout = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      syncTargetRect()
    }
    window.addEventListener('resize', handleLayout)
    window.addEventListener('scroll', handleLayout, true)
    onCleanup(() => {
      window.removeEventListener('resize', handleLayout)
      window.removeEventListener('scroll', handleLayout, true)
    })
  })

  const panelStyle = createMemo(() => {
    const rect = targetRect()
    const viewportWidth = viewport().width
    const viewportHeight = viewport().height
    const width = Math.min(PANEL_WIDTH, viewportWidth - 32)

    if (!rect) {
      return {
        left: `${Math.max(16, (viewportWidth - width) / 2)}px`,
        top: `${Math.max(24, (viewportHeight - 240) / 2)}px`,
        width: `${width}px`,
      }
    }

    const gap = 16
    const left = Math.min(Math.max(16, rect.left), viewportWidth - width - 16)
    const showAbove = rect.bottom + 260 > viewportHeight && rect.top > 280
    const top = showAbove ? rect.top - 220 - gap : rect.bottom + gap

    return {
      left: `${left}px`,
      top: `${Math.max(16, top)}px`,
      width: `${width}px`,
    }
  })

  const nextStep = () => {
    if (isLastStep()) {
      props.onClose()
      return
    }

    setCurrentIndex((index) => Math.min(index + 1, props.steps.length - 1))
  }

  const previousStep = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }

  return (
    <Show when={props.open && currentStep()}>
      {(step) => (
        <Portal>
          <div class='fixed inset-0 z-120 bg-slate-950/55 backdrop-blur-[2px]' onClick={props.onClose} />

          <Show when={targetRect()}>
            {(rect) => (
              <div
                class='pointer-events-none fixed z-121 rounded-[1.75rem] border-2 border-primary bg-primary/8 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)] transition-all duration-200'
                style={{
                  left: `${Math.max(8, rect().left - 8)}px`,
                  top: `${Math.max(8, rect().top - 8)}px`,
                  width: `${rect().width + 16}px`,
                  height: `${rect().height + 16}px`,
                }}
              />
            )}
          </Show>

          <div
            class='fixed z-122 overflow-hidden rounded-[1.75rem] border border-base-content/10 bg-base-100 shadow-2xl'
            style={panelStyle()}
          >
            <div class='space-y-4 p-5 sm:p-6'>
              <div class='flex items-start justify-between gap-4'>
                <div>
                  <p class='text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
                    Tour step {currentIndex() + 1} of {props.steps.length}
                  </p>
                  <h3 class='mt-2 text-xl font-semibold'>{step().title}</h3>
                </div>
                <button type='button' class='btn rounded-full btn-ghost btn-sm' onClick={props.onClose}>
                  Skip
                </button>
              </div>

              <p class='text-sm leading-6 text-base-content/70'>{step().message}</p>

              <div class='flex items-center justify-between gap-3 pt-2'>
                <button
                  type='button'
                  class='btn rounded-full px-5 btn-outline'
                  onClick={previousStep}
                  disabled={currentIndex() === 0}
                >
                  Back
                </button>
                <button type='button' class='btn rounded-full px-5 btn-primary' onClick={nextStep}>
                  {isLastStep() ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </Show>
  )
}

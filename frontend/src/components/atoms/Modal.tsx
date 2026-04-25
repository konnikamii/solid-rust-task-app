import { createEffect, createSignal, JSX, onCleanup, Show, untrack } from 'solid-js'
import { Portal } from 'solid-js/web'

export type ModalProps = {
  open: boolean
  onClose: () => void
  mount?: HTMLElement
  width?: number
  children: JSX.Element
}

const DURATION = 160

export default function Modal(props: ModalProps) {
  const [visible, setVisible] = createSignal(props.open)
  const [closing, setClosing] = createSignal(false)
  const dialogWidth = () => (props.width ? `${props.width}px` : '42rem')

  createEffect(() => {
    if (props.open) {
      setVisible(true)
      setClosing(false)
    } else if (untrack(visible)) {
      setClosing(true)
      const t = setTimeout(() => {
        setVisible(false)
        setClosing(false)
      }, DURATION)
      onCleanup(() => clearTimeout(t))
    }
  })

  return (
    <Show when={visible()}>
      <Portal mount={props.mount ?? document.body}>
        <button
          type='button'
          aria-label='Close dialog'
          onClick={props.onClose}
          class='fixed inset-0 z-100 cursor-auto bg-base-100/55 backdrop-blur-[1px]'
          style={{
            animation: closing()
              ? `backdrop-out ${DURATION}ms ease-in forwards`
              : `backdrop-in ${DURATION}ms ease-out forwards`,
          }}
        />
        <div class='pointer-events-none fixed inset-0 z-101 flex items-center justify-center p-4'>
          <div
            class='pointer-events-auto w-full max-w-full'
            style={{
              width: dialogWidth(),
              animation: closing()
                ? `modal-out ${DURATION}ms cubic-bezier(0.4,0,1,1) forwards`
                : `modal-in ${DURATION}ms cubic-bezier(0.34,1.56,0.64,1) forwards`,
            }}
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  )
}

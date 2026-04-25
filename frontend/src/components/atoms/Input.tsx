import { createSignal, Show, splitProps, type JSX, type JSXElement } from 'solid-js'
import { Eye, EyeOff } from 'lucide-solid'

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: JSXElement
  rightSlot?: JSXElement
  wrapperClass?: string
  inputClass?: string
  invalid?: boolean
  showPasswordToggle?: boolean
}

export default function Input(props: InputProps) {
  const [local, inputProps] = splitProps(props, [
    'leftIcon',
    'rightSlot',
    'wrapperClass',
    'inputClass',
    'invalid',
    'showPasswordToggle',
  ])
  const [visible, setVisible] = createSignal(false)

  const resolvedType = () => {
    if (local.showPasswordToggle) return visible() ? 'text' : 'password'
    return inputProps.type
  }

  return (
    <div
      class={`input-bordered input flex w-full items-center gap-2 ${local.invalid ? 'input-error' : ''} ${local.wrapperClass ?? ''}`}
    >
      {local.leftIcon}
      <input {...inputProps} type={resolvedType()} class={local.inputClass} aria-invalid={Boolean(local.invalid)} />
      <Show when={local.showPasswordToggle}>
        <button
          type='button'
          class='cursor-pointer hover:opacity-90'
          aria-label={visible() ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
        >
          {visible() ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </Show>
      {local.rightSlot}
    </div>
  )
}

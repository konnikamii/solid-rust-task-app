import { splitProps, type JSX, type JSXElement } from 'solid-js'

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  leftIcon?: JSXElement
  wrapperClass?: string
  textareaClass?: string
  invalid?: boolean
}

export default function Textarea(props: TextareaProps) {
  const [local, textareaProps] = splitProps(props, ['leftIcon', 'wrapperClass', 'textareaClass', 'invalid'])

  return (
    <div
      class={`input-bordered input h-auto w-full items-start gap-2 py-3 ${local.invalid ? 'input-error' : ''} ${local.wrapperClass ?? ''}`}
    >
      {local.leftIcon && <span class='mt-0.5 shrink-0'>{local.leftIcon}</span>}
      <textarea
        {...textareaProps}
        class={`w-full resize-none bg-transparent outline-none ${local.textareaClass ?? ''}`}
        aria-invalid={Boolean(local.invalid)}
      />
    </div>
  )
}

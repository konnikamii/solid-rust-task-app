import { splitProps, type JSX, type JSXElement } from 'solid-js'

type FormErrorProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  error?: string
  helperText?: string
  children?: JSXElement
}

export default function FormError(props: FormErrorProps) {
  const [local, rest] = splitProps(props, ['error', 'helperText', 'children', 'class'])
  const content = local.children ?? local.error ?? local.helperText

  return (
    <span
      {...rest}
      class={`mt-2 text-sm ${local.error ? 'text-error' : 'text-base-content/60'} ${local.class ?? ''}`.trim()}
    >
      {content}
    </span>
  )
}

export type { FormErrorProps }

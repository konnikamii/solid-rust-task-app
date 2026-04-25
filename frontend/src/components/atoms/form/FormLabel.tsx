import { splitProps, type JSX, type JSXElement } from 'solid-js'

type FormLabelProps = JSX.LabelHTMLAttributes<HTMLSpanElement> & {
  children: JSXElement
}

export default function FormLabel(props: FormLabelProps) {
  const [local, rest] = splitProps(props, ['children', 'class'])

  return (
    <span {...rest} class={`label-text mb-2 font-medium ${local.class ?? ''}`.trim()}>
      {local.children}
    </span>
  )
}

export type { FormLabelProps }

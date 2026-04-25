import { splitProps, type JSX } from 'solid-js'

type FormProps = JSX.FormHTMLAttributes<HTMLFormElement> & {
  formClass?: string
}

export default function Form(props: FormProps) {
  const [local, rest] = splitProps(props, ['formClass', 'class'])

  return <form {...rest} class={`${local.class ?? ''} ${local.formClass ?? ''}`.trim()} />
}

export type { FormProps }

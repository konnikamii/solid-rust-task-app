import FormError from '@Components/atoms/form/FormError'
import FormLabel from '@Components/atoms/form/FormLabel'
import { splitProps, type JSX, type JSXElement } from 'solid-js'

type FormControlProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & {
  children: JSXElement
  label?: JSXElement
  error?: string
  helperText?: string
  containerClass?: string
}

export default function FormControl(props: FormControlProps) {
  const [local, rest] = splitProps(props, ['children', 'label', 'error', 'helperText', 'containerClass', 'class'])

  return (
    <label {...rest} class={`form-control w-full ${local.class ?? ''} ${local.containerClass ?? ''}`.trim()}>
      {local.label && <FormLabel>{local.label}</FormLabel>}
      {local.children}
      {(local.error || local.helperText) && <FormError error={local.error} helperText={local.helperText} />}
    </label>
  )
}

export type { FormControlProps }

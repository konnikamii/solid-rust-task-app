import Input, { type InputProps } from '@Components/atoms/Input'

type FormInputProps = InputProps

export default function FormInput(props: FormInputProps) {
  return <Input {...props} />
}

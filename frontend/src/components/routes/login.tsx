import { type LoginRequest, loginSchema } from '@Src/lib/api/auth/auth.schema'
import { useLogin } from '@Src/lib/api/auth/auth'
import { FormControl, FormInput } from '@Components/atoms'
import { KeyRound, Mail } from 'lucide-solid'
import { useNavigate } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import toast from 'solid-toast'

type LoginField = keyof LoginRequest

const DEMO_CREDENTIALS = [
  { username: 'demo-admin', email: 'admin@taskify.local', password: 'Taskify123' },
  { username: 'demo-olivia', email: 'olivia@taskify.local', password: 'Taskify123' },
  { username: 'demo-mateo', email: 'mateo@taskify.local', password: 'Taskify123' },
] as const

const EMPTY_FORM: LoginRequest = {
  email: '',
  password: '',
}

export default function Login() {
  const [form, setForm] = createStore<LoginRequest>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = createStore<Partial<Record<LoginField, string>>>({})
  const loginMutation = useLogin()
  const navigate = useNavigate()

  const setFieldValue = (field: LoginField, value: string) => {
    setForm(field, value)
    setFieldErrors(field, undefined)
  }

  const fillRandomDemoCredentials = () => {
    const randomCredential = DEMO_CREDENTIALS[Math.floor(Math.random() * DEMO_CREDENTIALS.length)]

    setForm({
      email: randomCredential.email,
      password: randomCredential.password,
    })
    setFieldErrors({})
    toast.success(`Loaded demo account: ${randomCredential.username}`)
  }

  const validateForm = (data: LoginRequest) => {
    const result = loginSchema.safeParse(data)

    if (result.success) {
      setFieldErrors({})
      return true
    }

    const nextErrors: Partial<Record<LoginField, string>> = {}
    for (const issue of result.error.issues) {
      const path = issue.path[0] as LoginField | undefined
      if (path && !nextErrors[path]) {
        nextErrors[path] = issue.message
      }
    }

    setFieldErrors(nextErrors)
    return false
  }

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (!validateForm(form)) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    loginMutation.mutate(form, {
      onSuccess: () => {
        toast.success('Logged in successfully!')
        setForm(EMPTY_FORM)
        setFieldErrors({})
        navigate('/app/dashboard')
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Invalid credentials.'
        toast.error(message)
      },
    })
  }

  return (
    <div class='mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-xl items-center justify-center px-4 py-8 sm:px-6'>
      <form
        class='card w-full border border-base-300 bg-base-100/95 shadow-xl backdrop-blur-sm card-xl'
        noValidate
        onSubmit={onSubmit}
      >
        <div class='card-body'>
          <div class='mb-2 card-title text-3xl'>Sign in</div>
          <p class='mb-6 text-sm text-base-content/70'>Welcome back! Enter your credentials to continue.</p>

          <FormControl label='Email' error={fieldErrors.email}>
            <FormInput
              type='text'
              id='email'
              name='email'
              autocomplete='email'
              placeholder='name@example.com'
              value={form.email}
              leftIcon={<Mail size={18} class='opacity-60' />}
              invalid={Boolean(fieldErrors.email)}
              onInput={(e) => setFieldValue('email', e.currentTarget.value)}
            />
          </FormControl>

          <FormControl label='Password' error={fieldErrors.password} containerClass='mt-4'>
            <FormInput
              type='password'
              id='password'
              name='password'
              autocomplete='current-password'
              placeholder='Your password'
              value={form.password}
              leftIcon={<KeyRound size={18} class='opacity-60' />}
              showPasswordToggle
              invalid={Boolean(fieldErrors.password)}
              onInput={(e) => setFieldValue('password', e.currentTarget.value)}
            />
          </FormControl>

          <div class='mt-6 flex flex-col gap-3 sm:flex-row'>
            <button
              class='btn btn-outline sm:flex-1'
              type='button'
              disabled={loginMutation.isPending}
              onClick={fillRandomDemoCredentials}
            >
              Use random demo
            </button>

            <button class='btn btn-primary sm:flex-1' type='submit' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

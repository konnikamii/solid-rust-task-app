import { type UserCreate, userCreateSchema } from '@Src/lib/api/users/crud-user.schema'
import { useCreateUser } from '@Src/lib/api/users/users'
import { FormControl, FormInput } from '@Components/atoms'
import { KeyRound, Mail, User } from 'lucide-solid'
import { useNavigate } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import toast from 'solid-toast'

type UserField = keyof UserCreate

const EMPTY_USER: UserCreate = {
  email: '',
  username: '',
  password: '',
}

export default function Register() {
  const [user, setUser] = createStore<UserCreate>(EMPTY_USER)
  const [fieldErrors, setFieldErrors] = createStore<Partial<Record<UserField, string>>>({})
  const createUserMutation = useCreateUser()
  const navigate = useNavigate()

  const setFieldValue = (field: UserField, value: string) => {
    setUser(field, value)
    setFieldErrors(field, undefined)
  }

  const validateUser = (nextUser: UserCreate) => {
    const result = userCreateSchema.safeParse(nextUser)

    if (result.success) {
      setFieldErrors({})
      return true
    }

    const nextErrors: Partial<Record<UserField, string>> = {}
    for (const issue of result.error.issues) {
      const path = issue.path[0] as UserField | undefined
      if (path && !nextErrors[path]) {
        nextErrors[path] = issue.message
      }
    }

    setFieldErrors(nextErrors)
    return false
  }

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (!validateUser(user)) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    createUserMutation.mutate(user, {
      onSuccess: () => {
        toast.success('Account created successfully!')
        setUser(EMPTY_USER)
        setFieldErrors({})
        navigate('/app/dashboard')
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Unable to create account.'
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
          <div class='mb-2 card-title text-3xl'>Create account</div>
          <p class='mb-6 text-sm text-base-content/70'>
            Use a strong password with upper/lowercase letters and a number.
          </p>

          <FormControl label='Username' error={fieldErrors.username}>
            <FormInput
              type='text'
              id='username'
              name='username'
              autocomplete='username'
              placeholder='johndoe'
              value={user.username}
              leftIcon={<User size={18} class='opacity-60' />}
              invalid={Boolean(fieldErrors.username)}
              onInput={(e) => setFieldValue('username', e.currentTarget.value)}
            />
          </FormControl>

          <FormControl label='Email' error={fieldErrors.email} containerClass='mt-4'>
            <FormInput
              type='text'
              id='email'
              name='email'
              autocomplete='email'
              placeholder='name@example.com'
              value={user.email}
              leftIcon={<Mail size={18} class='opacity-60' />}
              invalid={Boolean(fieldErrors.email)}
              onInput={(e) => setFieldValue('email', e.currentTarget.value)}
            />
          </FormControl>

          <FormControl
            label='Password'
            error={fieldErrors.password}
            helperText='At least 6 chars, one uppercase, one lowercase, and one number.'
            containerClass='mt-4'
          >
            <FormInput
              type='password'
              id='password'
              name='password'
              autocomplete='password'
              placeholder='Create a strong password'
              value={user.password}
              leftIcon={<KeyRound size={18} class='opacity-60' />}
              showPasswordToggle
              invalid={Boolean(fieldErrors.password)}
              onInput={(e) => setFieldValue('password', e.currentTarget.value)}
            />
          </FormControl>

          <button class='btn mt-6 btn-primary' type='submit' disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? 'Creating account...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  )
}

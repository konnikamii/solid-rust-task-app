import { type ContactCreate, contactCreateSchema } from '@Src/lib/api/contact/contact.schema'
import { useCreateContactRequest } from '@Src/lib/api/contact/contact'
import { FormControl, FormInput, Textarea } from '@Components/atoms'
import { Mail, MessageSquare, Type } from 'lucide-solid'
import { createStore } from 'solid-js/store'
import toast from 'solid-toast'

type ContactField = keyof ContactCreate

const EMPTY_FORM: ContactCreate = {
  email: '',
  title: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = createStore<ContactCreate>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = createStore<Partial<Record<ContactField, string>>>({})
  const contactMutation = useCreateContactRequest()

  const setFieldValue = (field: ContactField, value: string) => {
    setForm(field, value)
    setFieldErrors(field, undefined)
  }

  const validateForm = (data: ContactCreate) => {
    const result = contactCreateSchema.safeParse(data)

    if (result.success) {
      setFieldErrors({})
      return true
    }

    const nextErrors: Partial<Record<ContactField, string>> = {}
    for (const issue of result.error.issues) {
      const path = issue.path[0] as ContactField | undefined
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

    contactMutation.mutate(form, {
      onSuccess: () => {
        toast.success('Message sent! We will get back to you soon.')
        setForm(EMPTY_FORM)
        setFieldErrors({})
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Failed to send message.'
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
          <div class='mb-2 card-title text-3xl'>Contact us</div>
          <p class='mb-6 text-sm text-base-content/70'>Got a question or feedback? We'd love to hear from you.</p>

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

          <FormControl label='Subject' error={fieldErrors.title} containerClass='mt-4'>
            <FormInput
              type='text'
              id='title'
              name='title'
              placeholder='What is this about?'
              value={form.title}
              leftIcon={<Type size={18} class='opacity-60' />}
              invalid={Boolean(fieldErrors.title)}
              onInput={(e) => setFieldValue('title', e.currentTarget.value)}
            />
          </FormControl>

          <FormControl label='Message' error={fieldErrors.message} containerClass='mt-4'>
            <Textarea
              id='message'
              name='message'
              rows={5}
              placeholder='Write your message here...'
              leftIcon={<MessageSquare size={18} class='opacity-60' />}
              invalid={Boolean(fieldErrors.message)}
              value={form.message}
              onInput={(e) => setFieldValue('message', e.currentTarget.value)}
            />
          </FormControl>

          <button class='btn mt-6 btn-primary' type='submit' disabled={contactMutation.isPending}>
            {contactMutation.isPending ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </form>
    </div>
  )
}

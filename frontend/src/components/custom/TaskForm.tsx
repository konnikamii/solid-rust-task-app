import { type TaskCreate, taskCreateSchema } from '@Src/lib/api/tasks/crud-task.schema'
import { FormControl, FormInput, Textarea } from '@Components/atoms'
import { AlignLeft, Calendar, Type } from 'lucide-solid'
import { createStore } from 'solid-js/store'
import toast from 'solid-toast'

type TaskFormProps = {
  onSubmit: (value: TaskCreate) => void | Promise<void>
  onCancel?: () => void
  pending?: boolean
  submitLabel?: string
  initialValues?: Partial<TaskCreate>
}

type TaskField = keyof TaskCreate

const EMPTY_FORM: TaskCreate = {
  title: '',
  description: '',
  dueDate: '',
  completed: false,
}

export default function TaskForm(props: TaskFormProps) {
  const initial = (): TaskCreate => ({ ...EMPTY_FORM, ...props.initialValues })

  const [form, setForm] = createStore<TaskCreate>(initial())
  const [fieldErrors, setFieldErrors] = createStore<Partial<Record<TaskField, string>>>({})

  const setFieldValue = <F extends TaskField>(field: F, value: TaskCreate[F]) => {
    setForm(field, value)
    setFieldErrors(field, undefined)
  }

  const validate = (data: TaskCreate) => {
    const result = taskCreateSchema.safeParse(data)

    if (result.success) {
      setFieldErrors({})
      return true
    }

    const nextErrors: Partial<Record<TaskField, string>> = {}
    for (const issue of result.error.issues) {
      const path = issue.path[0] as TaskField | undefined
      if (path && !nextErrors[path]) nextErrors[path] = issue.message
    }
    setFieldErrors(nextErrors)
    return false
  }

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const payload: TaskCreate = {
      title: form.title,
      description: form.description || null,
      dueDate: form.dueDate || null,
      completed: form.completed ?? false,
    }

    if (!validate(payload)) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    await props.onSubmit(payload)
  }

  return (
    <form onSubmit={onSubmit} noValidate class='flex flex-col gap-6'>
      <FormControl label='Title' error={fieldErrors.title}>
        <FormInput
          type='text'
          id='title'
          name='title'
          placeholder='Task title'
          value={form.title}
          leftIcon={<Type size={18} class='opacity-60' />}
          invalid={Boolean(fieldErrors.title)}
          onInput={(e) => setFieldValue('title', e.currentTarget.value)}
        />
      </FormControl>

      <FormControl label='Description' error={fieldErrors.description as string | undefined}>
        <Textarea
          id='description'
          name='description'
          rows={4}
          placeholder='Optional description...'
          leftIcon={<AlignLeft size={18} class='opacity-60' />}
          invalid={Boolean(fieldErrors.description)}
          value={form.description ?? ''}
          onInput={(e) => setFieldValue('description', e.currentTarget.value)}
        />
      </FormControl>

      <FormControl label='Due date' error={fieldErrors.dueDate as string | undefined}>
        <FormInput
          type='date'
          id='dueDate'
          name='dueDate'
          value={form.dueDate ?? ''}
          leftIcon={<Calendar size={18} class='opacity-60' />}
          invalid={Boolean(fieldErrors.dueDate)}
          onInput={(e) => setFieldValue('dueDate', e.currentTarget.value || null)}
        />
      </FormControl>

      <label class='flex cursor-pointer items-center gap-3'>
        <input
          type='checkbox'
          class='checkbox checkbox-primary'
          checked={form.completed ?? false}
          onChange={(e) => setFieldValue('completed', e.currentTarget.checked)}
        />
        <span class='text-sm font-medium'>Mark as completed</span>
      </label>

      <div class='flex flex-wrap gap-3 pt-2'>
        <button type='submit' class='btn rounded-full px-5 btn-primary' disabled={props.pending}>
          {props.pending ? 'Saving...' : (props.submitLabel ?? 'Save')}
        </button>
        {props.onCancel && (
          <button type='button' class='btn rounded-full px-5 btn-outline' onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

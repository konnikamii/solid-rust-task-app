import { type TaskUpdate } from '@Src/lib/api/tasks/crud-task.schema'
import { getTaskById, useDeleteTask, useUpdateTask } from '@Src/lib/api/tasks/tasks'
import TaskForm from '@Components/custom/TaskForm'
import { A, useNavigate, useParams } from '@solidjs/router'
import { createQuery } from '@tanstack/solid-query'
import { Show } from 'solid-js'
import toast from 'solid-toast'

export default function TaskById() {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const taskQuery = createQuery(() => ({
    queryKey: ['task', params.id],
    queryFn: () => getTaskById(params.id),
    enabled: params.id.length > 0,
  }))

  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  async function handleUpdate(value: TaskUpdate) {
    if (!params.id) {
      toast.error('Task id is missing.')
      return
    }
    try {
      await updateTaskMutation.mutateAsync({ id: params.id, body: value })
      toast.success('Task updated.')
      navigate('/app/tasks')
    } catch {
      toast.error('Task could not be updated right now.')
    }
  }

  async function handleDelete() {
    if (!params.id) {
      toast.error('Task id is missing.')
      return
    }
    if (typeof window !== 'undefined' && !window.confirm('Delete this task?')) return
    try {
      await deleteTaskMutation.mutateAsync(params.id)
      toast.success('Task deleted.')
      navigate('/app/tasks')
    } catch {
      toast.error('Task could not be deleted right now.')
    }
  }

  return (
    <div class='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      {/* Hero */}
      <div class='card overflow-hidden rounded-[2rem] border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/6 shadow-xl shadow-primary/5'>
        <div class='card-body gap-5 px-6 py-8 sm:px-8'>
          <div class='inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
            Tasks
          </div>
          <div class='space-y-3'>
            <h1 class='max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl'>Edit task</h1>
            <p class='max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base'>
              Update the details, due date, or completion state for this task.
            </p>
          </div>
        </div>
      </div>

      {/* Editor card */}
      <div class='card rounded-[2rem] border border-base-content/10 bg-base-100 shadow-sm'>
        <div class='card-body px-6 py-6 sm:px-7'>
          <div class='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Task editor</p>
              <h2 class='card-title text-2xl'>Update task details</h2>
            </div>
            <div class='flex flex-wrap gap-3'>
              <button
                type='button'
                class='btn rounded-full px-5 text-error btn-outline hover:text-error'
                disabled={deleteTaskMutation.isPending}
                onClick={handleDelete}
              >
                {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete task'}
              </button>
              <A href='/app/tasks' class='btn rounded-full px-5 btn-outline'>
                Back to tasks
              </A>
            </div>
          </div>

          <div class='mt-4'>
            <Show
              when={!taskQuery.isLoading}
              fallback={<div class='rounded-3xl bg-base-200/45 p-4 text-sm text-base-content/60'>Loading task...</div>}
            >
              <Show
                when={!taskQuery.isError && taskQuery.data}
                fallback={
                  <div class='rounded-3xl border border-error/20 bg-error/10 p-4 text-sm text-error'>
                    This task could not be loaded right now.
                  </div>
                }
              >
                {(task) => (
                  <TaskForm
                    initialValues={{
                      title: task().title,
                      description: task().description,
                      dueDate: task().dueDate,
                      completed: task().completed,
                    }}
                    onSubmit={handleUpdate}
                    pending={updateTaskMutation.isPending}
                    submitLabel='Save changes'
                  />
                )}
              </Show>
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}

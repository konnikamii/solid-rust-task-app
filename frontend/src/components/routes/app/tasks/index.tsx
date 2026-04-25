import { useDeleteTask, useGetPaginatedTasks } from '@Src/lib/api/tasks/tasks'
import CreateTaskModal from '@Components/custom/CreateTaskModal'
import { A } from '@solidjs/router'
import { createMemo, createSignal, For, Show } from 'solid-js'
import toast from 'solid-toast'

type TaskFilter = 'all' | 'open' | 'completed' | 'dueSoon'

const taskQuery = {
  page: 1,
  pageSize: 100,
  sortBy: 'createdAt' as const,
  sortType: 'desc' as const,
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'No due date'
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function dueTone(dueDate: string | null | undefined): string {
  if (!dueDate) return 'text-base-content/50'
  const now = Date.now()
  const dueTime = new Date(dueDate).getTime()
  if (dueTime < now) return 'text-error'
  if (dueTime - now <= 1000 * 60 * 60 * 24 * 3) return 'text-warning'
  return 'text-success'
}

export default function Tasks() {
  const tasksQuery = useGetPaginatedTasks(taskQuery)
  const deleteTaskMutation = useDeleteTask()

  const [activeFilter, setActiveFilter] = createSignal<TaskFilter>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false)
  const [deletingTaskId, setDeletingTaskId] = createSignal<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = createSignal<number | null>(null)

  const tasks = createMemo(() => tasksQuery.data?.entries ?? [])
  const openTasks = createMemo(() => tasks().filter((t) => !t.completed))
  const completedTasks = createMemo(() => tasks().filter((t) => t.completed))
  const dueSoonTasks = createMemo(() =>
    openTasks().filter((t) => {
      if (!t.dueDate) return false
      const delta = new Date(t.dueDate).getTime() - Date.now()
      return delta >= 0 && delta <= 1000 * 60 * 60 * 24 * 3
    }),
  )
  const filteredTasks = createMemo(() => {
    switch (activeFilter()) {
      case 'open':
        return openTasks()
      case 'completed':
        return completedTasks()
      case 'dueSoon':
        return dueSoonTasks()
      default:
        return tasks()
    }
  })
  const selectedTask = createMemo(
    () => tasks().find((t) => t.id === selectedTaskId()) ?? filteredTasks()[0] ?? tasks()[0] ?? null,
  )
  const completionRate = createMemo(() =>
    tasks().length === 0 ? 0 : Math.round((completedTasks().length / tasks().length) * 100),
  )

  function setFilter(next: TaskFilter) {
    setActiveFilter(next)
    setSelectedTaskId(null)
  }

  async function handleDeleteTask(taskId: number) {
    if (typeof window !== 'undefined' && !window.confirm('Delete this task?')) return

    setDeletingTaskId(taskId)
    try {
      await deleteTaskMutation.mutateAsync(String(taskId))
      if (selectedTaskId() === taskId) setSelectedTaskId(null)
      toast.success('Task deleted.')
    } catch {
      toast.error('Task could not be deleted right now.')
    } finally {
      setDeletingTaskId(null)
    }
  }

  const filterButtonClass = (f: TaskFilter) =>
    `btn btn-sm rounded-full px-5 ${activeFilter() === f ? 'btn-primary' : 'btn-outline'}`

  return (
    <div class='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      {/* Create modal */}
      <CreateTaskModal open={isCreateModalOpen()} onClose={() => setIsCreateModalOpen(false)} />

      {/* Hero + filter row */}
      <section class='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
        {/* Hero card */}
        <div class='card rounded-[2rem] border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/6 shadow-xl shadow-primary/5'>
          <div class='card-body gap-5 px-6 py-8 sm:px-8'>
            <div class='inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
              Tasks
            </div>
            <div class='space-y-3'>
              <h1 class='max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl'>
                Review the queue and focus the next move.
              </h1>
              <p class='max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base'>
                Keep the backlog visible, inspect a task quickly, and stay close to the work that needs attention next.
              </p>
            </div>
            <div class='flex flex-wrap gap-3'>
              <button
                type='button'
                class='btn rounded-full px-5 btn-primary'
                onClick={() => setIsCreateModalOpen(true)}
              >
                New task
              </button>
            </div>
            <div class='grid gap-4 sm:grid-cols-3'>
              <div class='rounded-3xl border border-base-content/10 bg-base-200/45 p-4 shadow-none'>
                <p class='text-sm text-base-content/60'>All tasks</p>
                <p class='mt-1 text-2xl font-bold'>{tasks().length}</p>
              </div>
              <div class='rounded-3xl border border-base-content/10 bg-base-200/45 p-4 shadow-none'>
                <p class='text-sm text-base-content/60'>Open / due soon</p>
                <p class='mt-1 text-2xl font-bold'>
                  {openTasks().length} / {dueSoonTasks().length}
                </p>
              </div>
              <div class='rounded-3xl border border-base-content/10 bg-base-200/45 p-4 shadow-none'>
                <p class='text-sm text-base-content/60'>Completion rate</p>
                <p class='mt-1 text-2xl font-bold'>{completionRate()}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter card */}
        <div class='card rounded-[2rem] border border-base-content/10 bg-base-100 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Filter the queue</p>
            <h2 class='card-title text-2xl'>Task lanes</h2>
            <div class='mt-2 flex flex-wrap gap-2'>
              <button class={filterButtonClass('all')} onClick={() => setFilter('all')}>
                All
              </button>
              <button class={filterButtonClass('open')} onClick={() => setFilter('open')}>
                Open
              </button>
              <button class={filterButtonClass('completed')} onClick={() => setFilter('completed')}>
                Completed
              </button>
              <button class={filterButtonClass('dueSoon')} onClick={() => setFilter('dueSoon')}>
                Due soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse + inspector row */}
      <section class='grid gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
        {/* Task list */}
        <div class='card rounded-[2rem] border border-base-content/10 bg-base-100 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-warning uppercase'>Task list</p>
            <h2 class='card-title text-2xl'>Browse and inspect</h2>
            <div class='mt-2 space-y-3'>
              <Show
                when={!tasksQuery.isLoading}
                fallback={
                  <div class='rounded-3xl bg-base-200/45 p-4 text-sm text-base-content/60'>Loading tasks...</div>
                }
              >
                <Show
                  when={!tasksQuery.isError}
                  fallback={
                    <div class='rounded-3xl border border-error/20 bg-error/10 p-4 text-sm text-error'>
                      Tasks could not be loaded right now.
                    </div>
                  }
                >
                  <Show
                    when={filteredTasks().length > 0}
                    fallback={
                      <div class='rounded-3xl border border-base-content/10 bg-base-200/35 p-4 text-sm text-base-content/60'>
                        No tasks match this filter yet.
                      </div>
                    }
                  >
                    <For each={filteredTasks()}>
                      {(task) => (
                        <button
                          type='button'
                          class={`group w-full rounded-3xl border p-4 text-left transition ${
                            selectedTask()?.id === task.id
                              ? 'border-primary/35 bg-primary/8 shadow-lg shadow-primary/8'
                              : 'border-base-content/10 bg-base-200/35 hover:border-primary/20 hover:bg-base-200/55'
                          }`}
                          onClick={() => setSelectedTaskId(task.id)}
                        >
                          <div class='flex items-start justify-between gap-4'>
                            <div class='space-y-2'>
                              <div class='flex flex-wrap items-center gap-2'>
                                <span
                                  class={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase ${
                                    task.completed ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content'
                                  }`}
                                >
                                  {task.completed ? 'Completed' : 'Open'}
                                </span>
                                <span class={`text-xs font-medium ${dueTone(task.dueDate)}`}>
                                  {formatDate(task.dueDate)}
                                </span>
                              </div>
                              <div>
                                <p class='text-base font-semibold'>{task.title}</p>
                                <p class='mt-1 text-sm leading-6 text-base-content/60'>
                                  {task.description ?? 'No description yet. Add some detail to make handoffs easier.'}
                                </p>
                              </div>
                            </div>
                            <div class='rounded-full border border-base-content/10 bg-base-100 px-3 py-1 text-xs text-base-content/50'>
                              #{task.id}
                            </div>
                          </div>
                        </button>
                      )}
                    </For>
                  </Show>
                </Show>
              </Show>
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div class='card rounded-[2rem] border border-base-content/10 bg-base-100 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-info uppercase'>Task inspector</p>
            <h2 class='card-title text-2xl'>Current selection</h2>
            <div class='mt-2 space-y-5'>
              <Show
                when={selectedTask()}
                fallback={
                  <div class='rounded-3xl border border-base-content/10 bg-base-200/35 p-4 text-sm text-base-content/60'>
                    Pick a task to inspect it here.
                  </div>
                }
              >
                {(task) => (
                  <div class='rounded-3xl border border-base-content/10 bg-base-200/40 p-5'>
                    <div class='flex flex-wrap items-start justify-between gap-3'>
                      <div>
                        <p class='text-xl font-semibold'>{task().title}</p>
                        <p class={`mt-2 text-sm font-medium ${dueTone(task().dueDate)}`}>
                          {formatDate(task().dueDate)}
                        </p>
                      </div>
                      <span
                        class={`rounded-full px-3 py-1 text-xs font-medium ${
                          task().completed ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content'
                        }`}
                      >
                        {task().completed ? 'Completed' : 'Open'}
                      </span>
                    </div>
                    <p class='mt-4 text-sm leading-6 text-base-content/60'>
                      {task().description ?? 'This task does not have a description yet.'}
                    </p>
                    <div class='mt-5 flex flex-wrap gap-3'>
                      <A href={`/app/tasks/${task().id}`} class='btn rounded-full px-5 btn-outline'>
                        Edit task
                      </A>
                    </div>
                  </div>
                )}
              </Show>

              <div class='space-y-3'>
                <div class='h-3 overflow-hidden rounded-full bg-base-200'>
                  <div
                    class='h-full bg-linear-to-r from-primary via-primary/80 to-success transition-[width] duration-300'
                    style={`width:${completionRate()}%`}
                  />
                </div>
                <p class='text-sm text-base-content/60'>
                  {completedTasks().length} of {tasks().length} tasks completed across the loaded queue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full table */}
      <div class='card rounded-[2rem] border border-base-content/10 bg-base-100 shadow-sm'>
        <div class='card-body px-6 py-6 sm:px-7'>
          <p class='text-xs font-semibold tracking-[0.28em] text-warning uppercase'>All tasks</p>
          <h2 class='card-title text-2xl'>Your task table</h2>
        </div>
        <Show
          when={!tasksQuery.isLoading}
          fallback={<div class='px-6 pb-6 text-sm text-base-content/60 sm:px-7'>Loading task table...</div>}
        >
          <Show
            when={!tasksQuery.isError}
            fallback={
              <div class='mx-6 mb-4 rounded-3xl border border-error/20 bg-error/10 p-4 text-sm text-error sm:mx-7'>
                The task table could not be loaded right now.
              </div>
            }
          >
            <div class='overflow-x-auto pb-2'>
              <table class='table'>
                <thead>
                  <tr class='border-base-content/10'>
                    <th class='pl-6 sm:pl-7'>Task</th>
                    <th>Status</th>
                    <th>Due date</th>
                    <th>Actions</th>
                    <th class='pr-6 text-right sm:pr-7'>ID</th>
                  </tr>
                </thead>
                <tbody>
                  <Show
                    when={tasks().length > 0}
                    fallback={
                      <tr>
                        <td colSpan={5} class='px-6 py-8 text-center text-base-content/60 sm:px-7'>
                          No tasks yet.
                        </td>
                      </tr>
                    }
                  >
                    <For each={tasks()}>
                      {(task) => (
                        <tr class='border-base-content/10 hover:bg-base-200/30'>
                          <td class='pl-6 sm:pl-7'>
                            <div class='space-y-1'>
                              <button
                                type='button'
                                class='text-left font-medium hover:text-primary'
                                onClick={() => {
                                  setSelectedTaskId(task.id)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                              >
                                {task.title}
                              </button>
                              <p class='max-w-xl truncate text-sm text-base-content/60'>
                                {task.description ?? 'No description'}
                              </p>
                            </div>
                          </td>
                          <td>
                            <span
                              class={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase ${
                                task.completed ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content'
                              }`}
                            >
                              {task.completed ? 'Completed' : 'Open'}
                            </span>
                          </td>
                          <td>
                            <span class={`font-medium ${dueTone(task.dueDate)}`}>{formatDate(task.dueDate)}</span>
                          </td>
                          <td>
                            <div class='flex flex-wrap gap-2'>
                              <A href={`/app/tasks/${task.id}`} class='btn rounded-full px-3 btn-ghost btn-sm'>
                                Edit
                              </A>
                              <button
                                type='button'
                                class='btn rounded-full px-3 text-error btn-ghost btn-sm hover:text-error'
                                disabled={deletingTaskId() === task.id}
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                {deletingTaskId() === task.id ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                          <td class='pr-6 text-right text-base-content/50 sm:pr-7'>#{task.id}</td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  )
}

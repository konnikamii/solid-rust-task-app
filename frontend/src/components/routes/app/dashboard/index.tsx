import type { TasksPaginatedRequest } from '@Src/lib/api/tasks/crud-task.schema'
import type { Task } from '@Src/lib/api/tasks/task.schema'
import Tour, { type TourStep } from '@Src/components/atoms/Tour'
import { useGetPaginatedTasks } from '@Src/lib/api/tasks/tasks'
import { useGetMe } from '@Src/lib/api/users/users'
import { createMemo, createSignal, For, Show } from 'solid-js'

const dashboardTaskQuery: TasksPaginatedRequest = {
  page: 1,
  pageSize: 100,
  sortBy: 'createdAt',
  sortType: 'desc',
  filters: {},
}

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    element: '#dashboard-tour-start',
    title: 'Start here',
    message: 'This button can reopen the dashboard tour any time you want a quick walkthrough.',
  },
  {
    element: '#dashboard-overview',
    title: 'Dashboard overview',
    message: 'This intro card is a good place to explain what changed today or what the user should focus on first.',
  },
  {
    element: '#dashboard-focus',
    title: 'Primary focus',
    message: 'Use this section for the most important work queue, deadline reminder, or personal productivity summary.',
  },
  {
    element: '#dashboard-stats',
    title: 'Stats grid',
    message: 'This panel summarizes your workload, urgency, and overall completion rate using live task data.',
  },
  {
    element: '#dashboard-priority',
    title: 'Priority lane',
    message:
      'The dashboard surfaces your most urgent open task first so you can move straight into the highest-risk item.',
  },
  {
    element: '#dashboard-upcoming',
    title: 'Upcoming work',
    message: 'This list keeps the next due tasks visible so deadlines do not disappear into a larger backlog.',
  },
  {
    title: 'You are ready',
    message:
      'The tour can finish with a centered message when you want to close with a general tip instead of pointing at one element.',
  },
]

function formatDate(value: string | null | undefined) {
  if (!value) return 'No due date'

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default function Dashboard() {
  const userQuery = useGetMe()
  const tasksQuery = useGetPaginatedTasks(dashboardTaskQuery)
  const [isTourOpen, setIsTourOpen] = createSignal(false)

  const now = createMemo(() => new Date().getTime())
  const tasks = createMemo(() => tasksQuery.data?.entries ?? [])
  const totalEntries = createMemo(() => tasksQuery.data?.totalEntries ?? 0)

  const openTasks = createMemo(() => tasks().filter((task) => !task.completed))
  const completedTasks = createMemo(() => tasks().filter((task) => task.completed))
  const overdueTasks = createMemo(() =>
    openTasks().filter((task) => {
      if (!task.dueDate) return false
      return new Date(task.dueDate).getTime() < now()
    }),
  )
  const dueSoonTasks = createMemo(() =>
    openTasks()
      .filter((task) => {
        if (!task.dueDate) return false
        const dueTime = new Date(task.dueDate).getTime()
        const delta = dueTime - now()
        return delta >= 0 && delta <= 1000 * 60 * 60 * 24 * 3
      })
      .sort((left, right) => new Date(left.dueDate!).getTime() - new Date(right.dueDate!).getTime()),
  )
  const unscheduledTasks = createMemo(() => openTasks().filter((task) => !task.dueDate))
  const completionRate = createMemo(() =>
    tasks().length === 0 ? 0 : Math.round((completedTasks().length / tasks().length) * 100),
  )
  const priorityTask = createMemo(() => {
    const ranked = [...openTasks()].sort((left, right) => {
      const leftDue = left.dueDate ? new Date(left.dueDate).getTime() : Number.POSITIVE_INFINITY
      const rightDue = right.dueDate ? new Date(right.dueDate).getTime() : Number.POSITIVE_INFINITY
      return leftDue - rightDue
    })

    return ranked[0] ?? null
  })
  const recentTasks = createMemo(() => tasks().slice(0, 5))
  const workloadLabel = createMemo(() => {
    if (overdueTasks().length > 0) return 'Needs attention'
    if (dueSoonTasks().length > 0) return 'On track'
    if (openTasks().length > 0) return 'Stable'
    return 'Clear'
  })

  const taskTone = (task: Task) => {
    if (!task.dueDate) return 'text-base-content/60'

    const dueTime = new Date(task.dueDate).getTime()
    if (dueTime < now()) return 'text-error'
    if (dueTime - now() <= 1000 * 60 * 60 * 24 * 3) return 'text-warning'
    return 'text-success'
  }

  function launchDashboardTour() {
    setIsTourOpen(true)
  }

  return (
    <div class='mx-auto flex w-full max-w-7xl flex-col gap-6 space-y-8 px-4 py-6 sm:px-6 lg:px-8'>
      <Tour open={isTourOpen()} steps={DASHBOARD_TOUR_STEPS} onClose={() => setIsTourOpen(false)} />

      <div
        id='dashboard-overview'
        class='card overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/5 shadow-xl shadow-primary/5'
      >
        <div class='card-body gap-6 px-6 py-8 sm:px-8'>
          <div class='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div class='max-w-2xl space-y-4'>
              <div class='inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
                Dashboard
              </div>
              <div class='space-y-2'>
                <h1 class='text-3xl font-semibold tracking-tight sm:text-4xl'>
                  Welcome back{userQuery.data?.username ? `, ${userQuery.data.username}` : ''}
                </h1>
                <p class='max-w-xl text-sm leading-6 text-base-content/60 sm:text-base'>
                  Keep your work visible, track delivery risk, and focus the day around the tasks that need action
                  first.
                </p>
              </div>
            </div>

            <div class='flex flex-wrap items-center gap-3'>
              <div class='rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
                {workloadLabel()}
              </div>

              <button
                id='dashboard-tour-start'
                type='button'
                class='btn btn-lg btn-primary'
                onClick={launchDashboardTour}
              >
                Start tour
              </button>
            </div>
          </div>
        </div>
      </div>

      <section id='dashboard-stats' class='grid gap-4 md:grid-cols-3'>
        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <p class='text-sm text-base-content/60'>Open tasks</p>
            <p class='text-3xl font-semibold'>{openTasks().length}</p>
            <p class='text-sm text-base-content/60'>Tasks that still need active work.</p>
          </div>
        </div>

        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <p class='text-sm text-base-content/60'>Completion rate</p>
            <p class='text-3xl font-semibold'>{completionRate()}%</p>
            <p class='text-sm text-success'>
              {completedTasks().length} of {tasks().length} tasks are done.
            </p>
          </div>
        </div>

        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <p class='text-sm text-base-content/60'>Due soon / overdue</p>
            <p class='text-3xl font-semibold'>{dueSoonTasks().length + overdueTasks().length}</p>
            <p class='text-sm text-warning'>
              {overdueTasks().length} overdue, {dueSoonTasks().length} due in 3 days.
            </p>
          </div>
        </div>
      </section>

      <section class='grid gap-4 lg:grid-cols-[1.3fr_0.9fr]'>
        <div id='dashboard-priority' class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <div class='flex items-start justify-between gap-3'>
              <div>
                <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Priority lane</p>
                <h2 class='text-2xl'>Move the most urgent work first</h2>
              </div>
              <div class='rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success'>
                Focus
              </div>
            </div>

            <div class='mt-4'>
              <Show
                when={!tasksQuery.isLoading}
                fallback={
                  <div class='rounded-2xl bg-base-200/60 p-4 text-sm text-base-content/60'>
                    Loading task priorities...
                  </div>
                }
              >
                <Show
                  when={!tasksQuery.isError}
                  fallback={
                    <div class='rounded-2xl border border-error/20 bg-error/10 p-4 text-sm text-error'>
                      The dashboard could not load your task summary right now.
                    </div>
                  }
                >
                  <Show
                    when={priorityTask()}
                    fallback={
                      <div class='rounded-2xl border border-info/20 bg-info/10 p-4 text-sm text-info'>
                        No urgent tasks right now. Your active queue is clear.
                      </div>
                    }
                  >
                    {(task) => (
                      <div
                        id='dashboard-focus'
                        class='card rounded-3xl border border-base-300/80 bg-base-200/35 shadow-none'
                      >
                        <div class='card-body'>
                          <div class='flex items-start justify-between gap-3'>
                            <div>
                              <h3 class='text-xl font-semibold'>{task().title}</h3>
                              <p class={`text-sm font-medium ${taskTone(task())}`}>{formatDate(task().dueDate)}</p>
                            </div>
                            <div class='rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/60'>
                              {task().completed ? 'Completed' : 'Open'}
                            </div>
                          </div>
                          <p class='text-sm leading-6 text-base-content/60'>
                            {task().description ??
                              'This task has no description yet. Add a short brief so collaborators can move faster.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </Show>
                </Show>
              </Show>
            </div>
          </div>
        </div>

        <div id='dashboard-upcoming' class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <p class='text-xs font-semibold tracking-[0.28em] text-accent uppercase'>Upcoming work</p>
            <h2 class='text-2xl'>What needs attention next</h2>

            <div class='mt-4'>
              <Show
                when={!tasksQuery.isLoading}
                fallback={<p class='text-sm text-base-content/60'>Loading upcoming tasks...</p>}
              >
                <div class='space-y-3'>
                  <For
                    each={dueSoonTasks().slice(0, 4)}
                    fallback={
                      <div class='rounded-2xl bg-base-200/45 p-4 text-sm text-base-content/60'>
                        No deadlines in the next three days.
                      </div>
                    }
                  >
                    {(task) => (
                      <div class='card rounded-2xl border border-base-300/70 bg-base-200/45 shadow-none'>
                        <div class='card-body py-4'>
                          <div class='flex items-start justify-between gap-3'>
                            <div>
                              <h3 class='text-sm font-semibold'>{task.title}</h3>
                              <p class={`mt-1 text-xs font-medium ${taskTone(task)}`}>{formatDate(task.dueDate)}</p>
                            </div>
                            <div class='rounded-full border border-base-300 bg-base-100 px-2 py-1 text-[11px] text-base-content/60'>
                              Due
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </section>

      <section class='grid gap-4 xl:grid-cols-[1.1fr_0.9fr]'>
        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <div class='flex items-start justify-between gap-3'>
              <div>
                <p class='text-xs font-semibold tracking-[0.28em] text-warning uppercase'>Workload health</p>
                <h2 class='text-2xl'>Snapshot of your current queue</h2>
              </div>
              <div class='rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/60'>
                {Math.min(tasks().length, totalEntries())} of {totalEntries()}
              </div>
            </div>

            <div class='mt-4 grid gap-3 sm:grid-cols-3'>
              <div class='card rounded-2xl border border-base-300/70 bg-base-200/50 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Overdue</p>
                  <p class='text-2xl font-semibold'>{overdueTasks().length}</p>
                </div>
              </div>
              <div class='card rounded-2xl border border-base-300/70 bg-base-200/50 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Scheduled</p>
                  <p class='text-2xl font-semibold'>{openTasks().length - unscheduledTasks().length}</p>
                </div>
              </div>
              <div class='card rounded-2xl border border-base-300/70 bg-base-200/50 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Unscheduled</p>
                  <p class='text-2xl font-semibold'>{unscheduledTasks().length}</p>
                </div>
              </div>
            </div>

            <div class='mt-6 h-3 overflow-hidden rounded-full bg-base-200'>
              <div class='h-full bg-linear-to-r from-primary to-success' style={`width:${completionRate()}%`} />
            </div>
            <p class='mt-3 text-sm text-base-content/60'>
              Completion rate across the loaded task set: {completionRate()}%.
            </p>
          </div>
        </div>

        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body'>
            <p class='text-xs font-semibold tracking-[0.28em] text-info uppercase'>Recent activity</p>
            <h2 class='text-2xl'>Latest tasks in your workspace</h2>

            <div class='mt-4 space-y-3'>
              <For
                each={recentTasks()}
                fallback={
                  <div class='rounded-2xl bg-base-200/45 p-4 text-sm text-base-content/60'>
                    No task activity yet. Create your first task to start tracking momentum.
                  </div>
                }
              >
                {(task) => (
                  <div class='card rounded-2xl border border-base-300/70 bg-base-200/45 shadow-none'>
                    <div class='card-body py-4'>
                      <div class='flex items-start justify-between gap-3'>
                        <div>
                          <h3 class='text-sm font-semibold'>{task.title}</h3>
                          <p class='text-sm text-base-content/60'>Created {formatDate(task.createdAt)}</p>
                        </div>
                        <div
                          class={`rounded-full px-2 py-1 text-[11px] font-medium ${
                            task.completed ? 'bg-success/10 text-success' : 'bg-secondary text-secondary-content'
                          }`}
                        >
                          {task.completed ? 'Done' : 'Open'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

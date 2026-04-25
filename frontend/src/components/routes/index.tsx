import { createMemo, createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { A } from '@solidjs/router'

type DemoTask = {
  id: number
  title: string
  lane: 'deep' | 'quick' | 'review'
  minutes: number
  note: string
  done: boolean
}

type DemoLane = 'all' | DemoTask['lane']

const INITIAL_TASKS: DemoTask[] = [
  {
    id: 1,
    title: 'Draft the landing copy',
    lane: 'deep',
    minutes: 45,
    note: 'Shape the value prop before the rest of the UI follows it.',
    done: false,
  },
  {
    id: 2,
    title: 'Reply to client questions',
    lane: 'quick',
    minutes: 15,
    note: 'Short, visible work that clears the queue fast.',
    done: true,
  },
  {
    id: 3,
    title: 'Review overdue tasks',
    lane: 'review',
    minutes: 20,
    note: 'Spot the items that need escalation before they slip further.',
    done: false,
  },
  {
    id: 4,
    title: "Plan tomorrow's focus block",
    lane: 'deep',
    minutes: 30,
    note: 'Use a quiet block to protect the next important deliverable.',
    done: false,
  },
]

function laneLabel(lane: DemoTask['lane']) {
  if (lane === 'deep') return 'Deep work'
  if (lane === 'quick') return 'Quick wins'
  return 'Review'
}

function laneBadgeClass(lane: DemoTask['lane']) {
  if (lane === 'deep') return 'bg-primary/10 text-primary'
  if (lane === 'quick') return 'bg-success/10 text-success'
  return 'bg-warning/10 text-warning'
}

export default function Home() {
  const [demoLane, setDemoLane] = createSignal<DemoLane>('all')
  const [selectedTaskId, setSelectedTaskId] = createSignal(INITIAL_TASKS[0].id)
  const [demoTasks, setDemoTasks] = createStore<DemoTask[]>(INITIAL_TASKS)

  const visibleTasks = createMemo(() => demoTasks.filter((t) => demoLane() === 'all' || t.lane === demoLane()))
  const completedCount = createMemo(() => demoTasks.filter((t) => t.done).length)
  const remainingMinutes = createMemo(() => demoTasks.filter((t) => !t.done).reduce((sum, t) => sum + t.minutes, 0))
  const completionRate = createMemo(() => Math.round((completedCount() / demoTasks.length) * 100))
  const selectedTask = createMemo(
    () => demoTasks.find((t) => t.id === selectedTaskId()) ?? visibleTasks()[0] ?? demoTasks[0],
  )
  const statusLabel = createMemo(() => {
    const rate = completionRate()
    if (rate >= 75) return 'Clear runway'
    if (rate >= 40) return 'Good momentum'
    return 'Needs focus'
  })

  function setLane(lane: DemoLane) {
    setDemoLane(lane)
    const next = demoTasks.filter((t) => lane === 'all' || t.lane === lane)
    if (next.length > 0) setSelectedTaskId(next[0].id)
  }

  function toggleTask(taskId: number) {
    const idx = demoTasks.findIndex((t) => t.id === taskId)
    if (idx === -1) return
    setDemoTasks(idx, 'done', !demoTasks[idx].done)
    setSelectedTaskId(taskId)
  }

  function resetDemo() {
    INITIAL_TASKS.forEach((t, i) => setDemoTasks(i, { ...t }))
    setDemoLane('all')
    setSelectedTaskId(INITIAL_TASKS[0].id)
  }

  return (
    <div class='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      <section class='grid gap-6 lg:grid-cols-[1.15fr_0.95fr]'>
        {/* Hero card */}
        <div class='card rounded-3xl border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/8 shadow-xl shadow-primary/5'>
          <div class='card-body gap-5 px-6 py-8 sm:px-8 sm:py-10'>
            <div class='inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
              Taskify
            </div>

            <div class='space-y-3'>
              <h1 class='max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl'>
                Plan the day, test the flow, and move into the real workspace fast.
              </h1>
              <p class='max-w-2xl text-base leading-7 text-base-content/60 sm:text-lg'>
                Explore the workflow, move through a focused queue, and step into the workspace when you are ready.
              </p>
            </div>

            <div class='flex flex-wrap gap-3'>
              <A href='/register' class='btn rounded-full px-5 btn-primary'>
                Create account
              </A>
              <A href='/login' class='btn rounded-full px-5 btn-outline'>
                Log in
              </A>
              <A href='/contact' class='btn rounded-full px-5 btn-ghost'>
                Ask a question
              </A>
            </div>

            <div class='mt-2 grid gap-4 sm:grid-cols-3'>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Live preview</p>
                  <p class='text-2xl font-semibold'>{completionRate()}%</p>
                </div>
              </div>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Minutes left</p>
                  <p class='text-2xl font-semibold'>{remainingMinutes()}</p>
                </div>
              </div>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Momentum</p>
                  <p class='text-2xl font-semibold'>{statusLabel()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive preview card */}
        <div class='card rounded-3xl border border-base-300/80 shadow-lg'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <div class='flex items-start justify-between gap-4'>
              <div class='space-y-1'>
                <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Interactive preview</p>
                <h2 class='text-2xl font-semibold'>Play with a sample workday</h2>
              </div>
              <button type='button' class='btn rounded-full btn-ghost btn-sm' onClick={resetDemo}>
                Reset
              </button>
            </div>

            <div class='mt-2 flex flex-wrap gap-2'>
              <For
                each={
                  [
                    { id: 'all', label: 'All' },
                    { id: 'deep', label: 'Deep work' },
                    { id: 'quick', label: 'Quick wins' },
                    { id: 'review', label: 'Review' },
                  ] as const
                }
              >
                {({ id, label }) => (
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${demoLane() === id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setLane(id)}
                  >
                    {label}
                  </button>
                )}
              </For>
            </div>

            <div class='mt-2 space-y-3'>
              <For
                each={visibleTasks()}
                fallback={
                  <div class='rounded-3xl border border-base-300/70 bg-base-200/35 p-4 text-sm text-base-content/60'>
                    No tasks in this lane. Switch the filter to explore the other preview items.
                  </div>
                }
              >
                {(task) => (
                  <button
                    type='button'
                    class={`group w-full rounded-3xl border p-4 text-left transition ${
                      task.id === selectedTaskId()
                        ? 'border-primary/40 bg-primary/8 shadow-lg shadow-primary/8'
                        : 'border-base-300/70 bg-base-200/35 hover:border-primary/20 hover:bg-base-200/55'
                    } ${task.done ? 'opacity-75' : ''}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div class='flex items-start justify-between gap-4'>
                      <div class='space-y-2'>
                        <div class='flex flex-wrap items-center gap-2'>
                          <span
                            class={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase ${laneBadgeClass(task.lane)}`}
                          >
                            {laneLabel(task.lane)}
                          </span>
                          <span class='text-xs text-base-content/60'>{task.minutes} min</span>
                        </div>
                        <div>
                          <p
                            class={`text-base font-semibold ${task.done ? 'text-base-content/50 line-through' : 'text-base-content'}`}
                          >
                            {task.title}
                          </p>
                          <p class='mt-1 text-sm leading-6 text-base-content/60'>{task.note}</p>
                        </div>
                      </div>

                      <div
                        class={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                          task.done
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary/30 group-hover:text-primary'
                        }`}
                      >
                        <Show when={task.done}>✓</Show>
                      </div>
                    </div>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      <section class='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
        {/* Selected task card */}
        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-accent uppercase'>Selected task</p>
            <h2 class='text-2xl font-semibold'>Why this pattern works</h2>

            <div class='rounded-3xl border border-base-300/70 bg-base-200/40 p-5'>
              <p class='text-sm font-medium tracking-[0.24em] text-base-content/60 uppercase'>Current item</p>
              <p class='mt-3 text-xl font-semibold'>{selectedTask()?.title}</p>
              <p class='mt-2 text-sm leading-6 text-base-content/60'>{selectedTask()?.note}</p>
            </div>

            <div class='space-y-3'>
              <div class='h-3 overflow-hidden rounded-full bg-base-200'>
                <div
                  class='h-full bg-linear-to-r from-primary via-secondary to-accent transition-[width] duration-300'
                  style={`width:${completionRate()}%`}
                />
              </div>
              <p class='text-sm text-base-content/60'>
                {completedCount()} of {demoTasks.length} tasks completed in the current queue.
              </p>
            </div>
          </div>
        </div>

        {/* CTA card */}
        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-info uppercase'>Start clean</p>
            <h2 class='text-2xl font-semibold'>Move from preview into the real workspace</h2>

            <div class='rounded-3xl border border-base-300/70 bg-base-200/40 p-5 sm:p-6'>
              <p class='max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base'>
                Explore the interaction, get a feel for the workflow, and step into the app when you are ready. If you
                need details before signing up, the contact page is available directly from the header.
              </p>
            </div>

            <div class='flex flex-wrap gap-3'>
              <A href='/register' class='btn rounded-full px-5 btn-primary'>
                Create account
              </A>
              <A href='/contact' class='btn rounded-full px-5 btn-outline'>
                Contact us
              </A>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

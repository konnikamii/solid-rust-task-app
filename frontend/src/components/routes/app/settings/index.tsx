import { useGetMe } from '@Src/lib/api/users/users'
import { createMemo, createSignal, Show } from 'solid-js'

type HomeView = 'dashboard' | 'tasks' | 'settings'
type Density = 'comfortable' | 'compact'

export default function Settings() {
  const userQuery = useGetMe()

  const [homeView, setHomeView] = createSignal<HomeView>('dashboard')
  const [density, setDensity] = createSignal<Density>('comfortable')
  const [digestEnabled, setDigestEnabled] = createSignal(true)
  const [deadlineWarnings, setDeadlineWarnings] = createSignal(true)
  const [focusMode, setFocusMode] = createSignal(false)

  const enabledCount = createMemo(() => [digestEnabled(), deadlineWarnings(), focusMode()].filter(Boolean).length)
  const profileInitials = createMemo(() => {
    const source = userQuery.data?.username ?? userQuery.data?.email ?? 'TU'
    return source.slice(0, 2).toUpperCase()
  })

  const togglePreference = (key: 'digestEnabled' | 'deadlineWarnings' | 'focusMode') => {
    if (key === 'digestEnabled') setDigestEnabled((v) => !v)
    if (key === 'deadlineWarnings') setDeadlineWarnings((v) => !v)
    if (key === 'focusMode') setFocusMode((v) => !v)
  }

  const resetPreferences = () => {
    setHomeView('dashboard')
    setDensity('comfortable')
    setDigestEnabled(true)
    setDeadlineWarnings(true)
    setFocusMode(false)
  }

  return (
    <div class='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      <section class='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <div class='card overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-br from-base-100 via-base-100 to-primary/6 shadow-xl shadow-primary/5'>
          <div class='card-body gap-5 px-6 py-8 sm:px-8'>
            <div class='inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-primary uppercase'>
              Settings
            </div>
            <div class='space-y-3'>
              <h1 class='max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl'>
                Tune the workspace around how you actually work.
              </h1>
              <p class='max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base'>
                Set the defaults you want to keep close and shape the workspace around your preferred flow.
              </p>
            </div>

            <div class='grid gap-4 sm:grid-cols-3'>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Home route</p>
                  <p class='text-2xl capitalize'>{homeView()}</p>
                </div>
              </div>

              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Density</p>
                  <p class='text-2xl capitalize'>{density()}</p>
                </div>
              </div>

              <div class='card rounded-3xl border border-base-300/70 bg-base-200/45 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Active assists</p>
                  <p class='text-2xl'>{enabledCount()}/3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Account</p>
            <h2 class='text-2xl'>Profile snapshot</h2>

            <div class='mt-4 space-y-4'>
              <Show
                when={!userQuery.isLoading}
                fallback={
                  <div class='rounded-3xl bg-base-200/45 p-4 text-sm text-base-content/60'>Loading your profile...</div>
                }
              >
                <Show
                  when={!userQuery.isError}
                  fallback={
                    <div class='rounded-3xl border border-error/20 bg-error/10 p-4 text-sm text-error'>
                      Profile details could not be loaded right now.
                    </div>
                  }
                >
                  <div class='flex items-center gap-4 rounded-3xl border border-base-300/70 bg-base-200/35 p-4'>
                    <div class='inline-flex size-14 items-center justify-center rounded-full bg-primary/12 text-lg font-semibold text-primary'>
                      {profileInitials()}
                    </div>
                    <div class='min-w-0'>
                      <p class='truncate text-lg font-semibold'>{userQuery.data?.username}</p>
                      <p class='truncate text-sm text-base-content/60'>{userQuery.data?.email}</p>
                    </div>
                  </div>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </section>

      <section class='grid gap-6 lg:grid-cols-[1fr_1fr]'>
        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <div class='flex items-start justify-between gap-4'>
              <div>
                <p class='text-xs font-semibold tracking-[0.28em] text-accent uppercase'>Workspace defaults</p>
                <h2 class='text-2xl'>Interactive preferences</h2>
              </div>
              <button type='button' class='btn rounded-full btn-ghost btn-sm' onClick={resetPreferences}>
                Reset
              </button>
            </div>

            <div class='mt-5 space-y-5'>
              <div class='space-y-3'>
                <p class='text-sm font-medium'>Default landing route</p>
                <div class='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${homeView() === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setHomeView('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${homeView() === 'tasks' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setHomeView('tasks')}
                  >
                    Tasks
                  </button>
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${homeView() === 'settings' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setHomeView('settings')}
                  >
                    Settings
                  </button>
                </div>
              </div>

              <div class='space-y-3'>
                <p class='text-sm font-medium'>Workspace density</p>
                <div class='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${density() === 'comfortable' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setDensity('comfortable')}
                  >
                    Comfortable
                  </button>
                  <button
                    type='button'
                    class={`btn rounded-full btn-sm ${density() === 'compact' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setDensity('compact')}
                  >
                    Compact
                  </button>
                </div>
              </div>

              <div class='space-y-3'>
                <p class='text-sm font-medium'>Assistive controls</p>
                <div class='grid gap-3'>
                  <button
                    type='button'
                    class='flex items-center justify-between rounded-3xl border border-base-300/70 bg-base-200/35 p-4 text-left transition hover:border-primary/20 hover:bg-base-200/50'
                    onClick={() => togglePreference('digestEnabled')}
                  >
                    <div>
                      <p class='font-medium'>Daily digest</p>
                      <p class='text-sm text-base-content/60'>
                        Start with a short summary of due work and completions.
                      </p>
                    </div>
                    <div
                      class={`rounded-full px-3 py-1 text-xs font-medium ${digestEnabled() ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-content'}`}
                    >
                      {digestEnabled() ? 'On' : 'Off'}
                    </div>
                  </button>

                  <button
                    type='button'
                    class='flex items-center justify-between rounded-3xl border border-base-300/70 bg-base-200/35 p-4 text-left transition hover:border-primary/20 hover:bg-base-200/50'
                    onClick={() => togglePreference('deadlineWarnings')}
                  >
                    <div>
                      <p class='font-medium'>Deadline warnings</p>
                      <p class='text-sm text-base-content/60'>
                        Highlight tasks that are due soon before they become urgent.
                      </p>
                    </div>
                    <div
                      class={`rounded-full px-3 py-1 text-xs font-medium ${deadlineWarnings() ? 'bg-warning/15 text-warning' : 'bg-secondary text-secondary-content'}`}
                    >
                      {deadlineWarnings() ? 'On' : 'Off'}
                    </div>
                  </button>

                  <button
                    type='button'
                    class='flex items-center justify-between rounded-3xl border border-base-300/70 bg-base-200/35 p-4 text-left transition hover:border-primary/20 hover:bg-base-200/50'
                    onClick={() => togglePreference('focusMode')}
                  >
                    <div>
                      <p class='font-medium'>Focus mode</p>
                      <p class='text-sm text-base-content/60'>
                        Reduce visual noise and emphasize the single most important task.
                      </p>
                    </div>
                    <div
                      class={`rounded-full px-3 py-1 text-xs font-medium ${focusMode() ? 'bg-success/15 text-success' : 'bg-secondary text-secondary-content'}`}
                    >
                      {focusMode() ? 'On' : 'Off'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='card rounded-3xl border border-base-300/80 shadow-sm'>
          <div class='card-body px-6 py-6 sm:px-7'>
            <p class='text-xs font-semibold tracking-[0.28em] text-info uppercase'>Preview</p>
            <h2 class='text-2xl'>Workspace summary</h2>

            <div class='mt-5 rounded-3xl border border-base-300/70 bg-base-200/40 p-5'>
              <p class='text-sm font-medium tracking-[0.24em] text-base-content/60 uppercase'>Workspace summary</p>
              <p class='mt-3 text-xl font-semibold'>
                {homeView().charAt(0).toUpperCase() + homeView().slice(1)} opens first
              </p>
              <p class='mt-2 text-sm leading-6 text-base-content/60'>
                The workspace is set to a {density()} layout with {enabledCount()} assistive feature
                {enabledCount() === 1 ? '' : 's'} enabled.
              </p>
            </div>

            <div class='mt-5 grid gap-3 sm:grid-cols-3'>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/40 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Digest</p>
                  <p class='text-xl'>{digestEnabled() ? 'Enabled' : 'Muted'}</p>
                </div>
              </div>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/40 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Warnings</p>
                  <p class='text-xl'>{deadlineWarnings() ? 'Visible' : 'Hidden'}</p>
                </div>
              </div>
              <div class='card rounded-3xl border border-base-300/70 bg-base-200/40 shadow-none'>
                <div class='card-body py-4'>
                  <p class='text-sm text-base-content/60'>Focus mode</p>
                  <p class='text-xl'>{focusMode() ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

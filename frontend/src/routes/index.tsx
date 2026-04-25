import { createSignal } from 'solid-js'
import { A } from '@solidjs/router'

export default function Home() {
  const [show, setShow] = createSignal(false)
  return (
    <main class='mx-auto p-4 text-center'>
      <h1 class='max-6-xs my-16 text-6xl font-thin uppercase'>Hello world!</h1>
      {/* <Counter /> */}
      <br />
      <br />
      <br />
      <button
        class='border-primary bg-secondary border p-44'
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        Test
      </button>
      {show() && <div>Hello</div>}
    </main>
  )
}

import { A, useParams } from '@solidjs/router'
import Counter from '@Components/Counter'

export default function UserById() {
  const params = useParams()
  return <div class='mx-auto p-4 text-center text-gray-700'>This is user {params.id}</div>
}

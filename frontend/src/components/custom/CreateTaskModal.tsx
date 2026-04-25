import { type TaskCreate } from '@Src/lib/api/tasks/crud-task.schema'
import { useCreateTask } from '@Src/lib/api/tasks/tasks'
import Modal from '@Components/atoms/Modal'
import TaskForm from '@Components/custom/TaskForm'
import toast from 'solid-toast'

type CreateTaskModalProps = {
  open: boolean
  onClose: () => void
  mount?: HTMLElement
}

export default function CreateTaskModal(props: CreateTaskModalProps) {
  const createTaskMutation = useCreateTask()

  async function handleSubmit(value: TaskCreate) {
    try {
      await createTaskMutation.mutateAsync(value)
      props.onClose()
      toast.success('Task created.')
    } catch {
      toast.error('Task could not be created right now.')
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose} mount={props.mount} width={700}>
      <div class='card w-full rounded-[2rem] border border-base-content/10 bg-base-100 shadow-2xl'>
        <div class='card-body px-6 py-6 sm:px-7'>
          <p class='text-xs font-semibold tracking-[0.28em] text-success uppercase'>Create task</p>
          <h2 class='card-title text-2xl'>Add a new task</h2>
          <div class='mt-4'>
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={props.onClose}
              pending={createTaskMutation.isPending}
              submitLabel='Create task'
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

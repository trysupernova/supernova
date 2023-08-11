import { CreateTask, Task, TaskPriority } from '@renderer/types/task'
import { css, cva, cx } from '@styled-system/css'
import { circle, hstack, vstack } from '@styled-system/patterns'
import { Check, Edit } from 'lucide-react'
import TimerWidget from './TimerWidget'
import LabelWidget from './LabelWidget'
import { useBoolean, useToggle } from 'usehooks-ts'
import StartTimeWidget from './StartTimeWidget'
import CreateTaskWidget from './CreateTaskWidget'
import Modal from './Modal'

interface Props {
  task: Task
  onTaskCheck?: (newDoneState: boolean) => void
  onTaskEdit?: (newTask: CreateTask) => void
}

export const TaskComponent = ({
  task: { title, description, priority, expectedDurationMinutes, labels, startTime, done, id },
  onTaskCheck,
  onTaskEdit
}: Props) => {
  const [showCheck, , setShowCheck] = useToggle()
  const { value: mouseOnTask, setValue: setMouseOnTask } = useBoolean()
  const checked = done
  let realizedPriority: 'high' | 'medium' | 'low' | 'none' | undefined = undefined
  switch (priority) {
    case TaskPriority.HIGH:
      realizedPriority = 'high'
      break
    case TaskPriority.MEDIUM:
      realizedPriority = 'medium'
      break
    case TaskPriority.LOW:
      realizedPriority = 'low'
      break
    case TaskPriority.NONE:
      realizedPriority = 'none'
      break
    default:
      break
  }

  const {
    value: modalOpen,
    setTrue: openModal,
    setFalse: closeModal,
    setValue: setOpenModal
  } = useBoolean()

  return (
    <div
      onMouseEnter={() => {
        setMouseOnTask(true)
      }}
      onMouseLeave={() => {
        setMouseOnTask(false)
      }}
      className={hstack({
        borderTop: '0.5px solid',
        borderBottom: '0.5px solid',
        borderColor: 'gray.800',
        padding: '8px',
        gap: 3,
        borderCollapse: 'collapse',
        width: 'full',
        transition: 'ease-in-out',
        transitionDuration: 'fast',
        filter: checked ? 'brightness(0.3)' : 'none',
        position: 'relative'
      })}
      key={id}
    >
      {mouseOnTask && (
        <button
          className={css({
            position: 'absolute',
            bottom: 3,
            right: 3
          })}
          onClick={() => {
            openModal()
          }}
        >
          <Edit color="white" />
        </button>
      )}
      <Modal isOpen={modalOpen} onOpenChange={setOpenModal}>
        <CreateTaskWidget
          submitButtonChildren="Edit task"
          initialCreateTask={{
            title,
            priority,
            description,
            expectedDurationMinutes,
            startTime
          }}
          onSubmitTask={(newTask) => {
            if (onTaskEdit) onTaskEdit(newTask)
            closeModal()
          }}
        />
      </Modal>
      <div>
        <input
          type="checkbox"
          id={`check-${id}`}
          name={`check-${id}`}
          checked={checked}
          onChange={() => {
            if (onTaskCheck) onTaskCheck(!checked)
          }}
          className={css({ visibility: 'hidden', display: 'none' })}
        />
        <label
          htmlFor={`check-${id}`}
          className={cx(circle(), taskCheckbox({ priority: realizedPriority }))}
          onMouseEnter={() => {
            setShowCheck(true)
          }}
          onMouseLeave={() => {
            setShowCheck(false)
          }}
        >
          {showCheck && <Check width={15} className={css({ color: 'white' })} />}
        </label>
      </div>
      <div className={vstack({ alignItems: 'start', gap: 0, flex: 1 })}>
        <p className={css({ textDecoration: checked ? 'line-through' : 'none' })}>{title}</p>
        <div className={hstack({ alignItems: 'center', gap: 2, marginBottom: '3px' })}>
          <p className={css({ color: 'gray.400', fontSize: 'small' })}>{description}</p>
        </div>
        <div className={hstack()}>
          {startTime && <StartTimeWidget time={startTime} />}
          {labels?.map((el) => (
            <LabelWidget color={el.color} title={el.title} key={el.id} />
          ))}
        </div>
      </div>
      <div
        className={css({
          justifySelf: 'end',
          alignSelf: 'start'
        })}
      >
        <TimerWidget minutes={expectedDurationMinutes} />
      </div>
    </div>
  )
}

export default TaskComponent

const taskCheckbox = cva({
  base: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: '2px solid gray',
    width: '25px',
    height: '25px',
    _hover: {
      backgroundColor: 'gray.800'
    },
    transition: 'ease-in-out',
    transitionDuration: 'fastest',
    cursor: 'pointer'
  },
  variants: {
    priority: {
      high: {
        bg: 'red.950',
        borderColor: 'red',
        _hover: {
          bg: 'red.800'
        }
      },
      medium: {
        bg: 'yellow.950',
        borderColor: 'yellow',
        _hover: {
          bg: 'yellow.800'
        }
      },
      low: {
        bg: 'blue.950',
        borderColor: 'blue',
        _hover: {
          bg: 'blue.800'
        }
      },
      none: {}
    }
  }
})

import { css, cx } from '@styled-system/css'
import { container, hstack, vstack } from '@styled-system/patterns'
import { useRef, useState } from 'react'
import Button from './Button'
import { CreateTask, TaskPriority } from '@renderer/types/task'
import TimerWidget from './TimerWidget'
import StartTimeWidget from './StartTimeWidget'

interface Props {
  onSubmitTask?: (createTask: CreateTask) => void
  initialCreateTask?: CreateTask
  submitButtonChildren?: React.ReactNode
}

export const CreateTaskWidget = (props: Props) => {
  const [createTask, setCreateTask] = useState<CreateTask>(
    props.initialCreateTask ?? {
      title: '',
      priority: TaskPriority.NONE
    }
  )

  const priorityRegex = /!!(1|2|3|4)/
  const expectedDurationsRegex = /for (\d+)\s*(mins|minutes)/
  const labelsRegex = /@(\w+)/g
  const startTimeRegex = /at (\d+)\s*(am|pm)/

  return (
    <form
      className={cx(
        container({
          border: 'thin solid gray',
          borderColor: 'gray.700',
          rounded: 'xl',
          paddingBottom: '20px',
          paddingTop: '20px',
          bg: 'black'
        }),
        vstack({ alignItems: 'baseline' })
      )}
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!props.onSubmitTask) return
        const newState = { ...createTask }
        // clear the title from the annotated task attributes
        newState.title = newState.title.replace(priorityRegex, '')
        newState.title = newState.title.replace(expectedDurationsRegex, '')
        newState.title = newState.title.replace(labelsRegex, '')
        newState.title = newState.title.replace(startTimeRegex, '')
        props.onSubmitTask(newState)
      }}
    >
      <textarea
        id="createTaskTitle"
        value={createTask.title}
        onChange={(ev) => {
          const input = ev.target.value
          const expectedDurationsMin = expectedDurationsRegex.exec(input)
          const detectedPriority = priorityRegex.exec(input)
          const detectedLabels = input.match(labelsRegex)
          const detectedStartTime = input.match(startTimeRegex)
          setCreateTask((prev) => {
            const newState = { ...prev, title: input }
            if (expectedDurationsMin && expectedDurationsMin[1]) {
              newState.expectedDurationMinutes = Number(expectedDurationsMin[1])
            } else {
              newState.expectedDurationMinutes = props.initialCreateTask?.expectedDurationMinutes
            }
            if (detectedLabels && detectedLabels.length > 0) {
              newState.labelNames = detectedLabels.map((el) => el.replace('@', ''))
            } else {
              newState.labelNames = props.initialCreateTask?.labelNames ?? []
            }
            if (detectedPriority && detectedPriority.length > 0) {
              newState.priority = Number(detectedPriority[1]) as TaskPriority
            } else {
              newState.priority = props.initialCreateTask?.priority ?? TaskPriority.NONE
            }
            if (detectedStartTime && detectedStartTime.length > 0) {
              const today = new Date()
              let hour = Number(detectedStartTime[1])
              if (detectedStartTime[2] === 'pm') {
                hour += 12
              }
              today.setHours(hour, 0, 0, 0)
              newState.startTime = today
            } else {
              newState.startTime = props.initialCreateTask?.startTime
            }
            return newState
          })
        }}
        placeholder="Task name"
        className={css({
          appearance: 'none',
          bg: 'black',
          color: 'white',
          outline: 'none',
          fontSize: 'xl',
          width: 'full',
          resize: 'none'
        })}
      />
      <input
        placeholder={'Description'}
        value={createTask.description}
        onChange={(ev) => {
          setCreateTask((prev) => ({ ...prev, description: ev.target.value }))
        }}
        className={css({ appearance: 'none', bg: 'black', color: 'white', outline: 'none' })}
      />
      <div className={hstack({ justifyContent: 'space-between', width: 'full' })}>
        <div className={hstack()}>
          {createTask.startTime && <StartTimeWidget time={createTask.startTime} />}
          {createTask.expectedDurationMinutes && (
            <TimerWidget minutes={createTask.expectedDurationMinutes} />
          )}
          {createTask.labelNames?.map((labelname, i) => (
            <span key={i}>{labelname}</span>
          ))}
          <p>{createTask.priority}</p>
        </div>
        <Button type="submit">{props.submitButtonChildren ?? 'Add task'}</Button>
      </div>
    </form>
  )
}

export default CreateTaskWidget

import TaskComponent from '@renderer/components/Task'
import { useEffect, useState } from 'react'
import { CreateTask, Task, TaskPriority } from '@renderer/types/task'
import { box, container, hstack, vstack } from '@styled-system/patterns'
import CreateTaskWidget from '@renderer/components/CreateTaskWidget'
import Modal from '@renderer/components/Modal'
import { useToggle } from 'usehooks-ts'
import { css } from '@styled-system/css'
import { reevalListOrder } from '@renderer/utils/algo'
import ld from 'lodash'
import UserWidget from '@renderer/components/UserWidget'
import { useUserStore } from '@renderer/store/user'
import { ProtectedView } from '@renderer/utils/protected'
import Mousetrap from 'mousetrap'

function TodayTasksPage(): JSX.Element {
  const userSession = useUserStore((state) => state.user)
  const [todayTasks, setTodayTasks] = useState<Task[]>([
    {
      title: 'Work on Grance',
      description: '30mins',
      id: '12312312312',
      priority: TaskPriority.NONE,
      startTime: new Date()
    },
    {
      title: 'Another medium task',
      description: '30mins',
      id: 'sdasasds',
      priority: TaskPriority.MEDIUM,
      expectedDurationMinutes: 30,
      labels: [
        {
          id: '1231',
          title: 'grance',
          color: 'green.100'
        }
      ]
    },
    {
      title: 'Do some stuff',
      description: '30mins',
      id: 'sda',
      priority: TaskPriority.MEDIUM,
      expectedDurationMinutes: 30,
      labels: [
        {
          id: '1231',
          title: 'grance',
          color: 'green.100'
        }
      ]
    },
    {
      title: 'Make some monkey task',
      description: '30mins',
      id: '1231231',
      priority: TaskPriority.HIGH,
      expectedDurationMinutes: 30,
      labels: [
        {
          id: '1231',
          title: 'grance',
          color: 'green.100'
        }
      ]
    }
  ])

  // whenever we add to today tasks we sort and update the list with the sort
  useEffect(() => {
    const reorderedTasks = reevalListOrder(todayTasks)
    if (!ld.isEqual(reorderedTasks, todayTasks)) {
      setTodayTasks(reorderedTasks)
    }
  }, [todayTasks])

  // setting window title
  useEffect(() => {
    document.title = 'Today | supernova'
  }, [])

  const [modalOpen, , setModalOpen] = useToggle(false)

  // for creating task
  Mousetrap.bind(['q', 'c'], () => {
    setModalOpen(true)
  })
  // for moving up and down the list with keybinds
  const [outlinedTaskIndex, setOTI] = useState<number>(-1)
  Mousetrap.bind(['down', 'j'], () => {
    setOTI((prev) => (prev + 1) % todayTasks.length)
  })
  Mousetrap.bind(['up', 'k'], () => {
    if (outlinedTaskIndex == -1) {
      setOTI(todayTasks.length - 1)
      return
    }
    setOTI((prev) => (todayTasks.length + prev - 1) % todayTasks.length)
  })
  Mousetrap.bind('esc', () => {
    setOTI(-1)
  })

  // marking the task as done
  Mousetrap.bind('d', () => {
    if (outlinedTaskIndex < 0 || outlinedTaskIndex >= todayTasks.length) return
    checkTask(todayTasks[outlinedTaskIndex].id)
  })
  Mousetrap.bind(['z', 'u'], () => {
    if (outlinedTaskIndex < 0 || outlinedTaskIndex >= todayTasks.length) return
    uncheckTask(todayTasks[outlinedTaskIndex].id)
  })

  const checkTask = (taskId: string) => {
    setTodayTasks((prev) => {
      const foundIndex = prev.findIndex((el) => el.id === taskId)
      if (foundIndex < 0) return prev
      if (prev[foundIndex].done) return prev // already checked
      const pre = prev.filter((_, i) => i < foundIndex)
      const post = prev.filter((_, i) => i > foundIndex)
      const newList = reevalListOrder([...pre, { ...prev[foundIndex], done: true }, ...post])
      return newList
    })
  }

  const uncheckTask = (taskId: string) => {
    setTodayTasks((prev) => {
      const foundIndex = prev.findIndex((el) => el.id === taskId)
      if (foundIndex < 0) return prev
      if (!prev[foundIndex].done) return prev // already unchecked
      const pre = prev.filter((_, i) => i < foundIndex)
      const post = prev.filter((_, i) => i > foundIndex)
      const newList = reevalListOrder([...pre, { ...prev[foundIndex], done: false }, ...post])
      return newList
    })
  }

  const updateTaskDetails = (taskId: string, newTask: CreateTask) => {
    setTodayTasks((prev) => {
      const newState = [...prev]
      const taskIndex = todayTasks.findIndex((el) => el.id === taskId)
      if (taskIndex < 0) return prev // don't update if can't find
      newState[taskIndex] = { ...newState[taskIndex], ...newTask }
      return newState
    })
  }

  // click anywhere and it will unfocus
  useEffect(() => {
    const handle = (ev: MouseEvent) => {
      ev.preventDefault()
      setOTI(-1)
    }
    document.addEventListener('click', handle)
    return () => {
      document.removeEventListener('click', handle)
    }
  })

  return (
    <ProtectedView>
      <div className={container()}>
        {outlinedTaskIndex}
        <div className={hstack({ justify: 'space-between' })}>
          <h1 className={css({ fontSize: '4xl', fontWeight: 'medium', lineHeight: 'relaxed' })}>
            Today
          </h1>
          <div>
            <UserWidget userData={userSession} />
          </div>
        </div>
        <div
          className={vstack({
            alignItems: 'center',
            gap: 0
          })}
        >
          {todayTasks.map((task, taskIndex) => (
            <div
              key={task.id}
              className={box({
                border: taskIndex === outlinedTaskIndex ? '3px solid' : '',
                borderColor: 'cyan.500',
                width: 'full',
                bg: taskIndex === outlinedTaskIndex ? 'cyan.900' : 'none',
                rounded: 'md'
              })}
            >
              <TaskComponent
                task={task}
                onTaskCheck={() => {
                  checkTask(task.id)
                }}
                onTaskEdit={(newTask) => {
                  updateTaskDetails(task.id, newTask)
                }}
              />
            </div>
          ))}
        </div>
        <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
          <CreateTaskWidget
            onSubmitTask={(createTask) => {
              setModalOpen(false)
              console.log('creating new task...')
              setTodayTasks((prev) => {
                return reevalListOrder([
                  ...prev,
                  {
                    id: String(Math.random() * 1000),
                    ...createTask,
                    labels:
                      createTask.labelNames?.map((el) => ({
                        id: String(Math.random() * 1000),
                        title: el,
                        color: 'green'
                      })) ?? []
                  }
                ])
              })
            }}
          />
        </Modal>
      </div>
    </ProtectedView>
  )
}

export default TodayTasksPage

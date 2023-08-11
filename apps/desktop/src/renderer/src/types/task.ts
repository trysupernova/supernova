export interface TaskLabel {
  id: string
  title: string
  color: string
}

export enum TaskPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  NONE = 4
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  expectedDurationMinutes?: number
  startTime?: Date
  labels?: TaskLabel[]
  done?: boolean
}

export interface CreateTask {
  title: string
  description?: string
  priority: TaskPriority
  expectedDurationMinutes?: number
  startTime?: Date
  labelNames?: string[]
}

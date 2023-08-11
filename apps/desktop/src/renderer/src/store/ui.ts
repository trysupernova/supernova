import { create } from 'zustand'
import { Task } from '../types/task'

interface State {
  taskEditModal: {
    open: boolean
    editingTaskId: Task['id'] | null
  }
  taskCreateModal: {
    open: boolean
  }
}

export const useUserStore = create<State>((set) => ({
  taskEditModal: {
    open: false,
    editingTaskId: null
  },
  taskCreateModal: {
    open: false
  },
  openTaskCreateModal: () =>
    set((state) => ({ ...state, taskCreateModal: { ...state.taskCreateModal, open: true } })),
  closeTaskCreateModal: () => {
    set((state) => ({ ...state, taskCreateModal: { ...state.taskCreateModal, open: false } }))
  },
  openTaskEditModal: (editingTaskId: Task['id']) => {
    set((state) => ({
      ...state,
      taskCreateModal: { ...state.taskCreateModal, open: false }, // toggle off this one if the user was still having it open
      taskEditModal: { ...state.taskEditModal, open: true, editingTaskId }
    }))
  },
  closeTaskEditModal: () => {
    set((state) => ({
      ...state,
      taskCreateModal: { ...state.taskCreateModal, open: false }, // toggle off this one if the user was still having it open
      taskEditModal: { ...state.taskEditModal, open: false, editingTaskId: null }
    }))
  }
}))

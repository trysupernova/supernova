import { Task } from '@renderer/types/task'

export const reevalListOrder = (list: Task[]) => {
  const newList = [...list]
  newList
    .sort((a, b) => {
      if (a.startTime && !b.startTime) {
        return -1 // time -> go first
      } else if (!a.startTime && b.startTime) {
        return 1 // no time -> not first
      } else if (!a.startTime && !b.startTime) {
        return 0 // don't sort
      } else if (a.startTime && b.startTime) {
        const adate = a.startTime.valueOf()
        const bdate = b.startTime.valueOf()
        return adate - bdate
      }
      return 0
    })
    .sort((a, b) => {
      // sort by priority if no start time because
      // start time overrides everything
      if (!a.startTime && !b.startTime) {
        return a.priority - b.priority
      }
      return 0
    })
    .sort((a, b) => {
      // 1 = done
      // 0 = not done
      return Number(a?.done ?? false) - Number(b?.done ?? false)
    })
  return newList
}

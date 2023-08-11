import { UserSession, useUserStore } from '@renderer/store/user'
import { hstack } from '@styled-system/patterns'
import Button from './Button'

export type Props = {
  userData: UserSession | null
}

export const UserWidget = ({ userData }: Props) => {
  const { clearUser } = useUserStore()

  if (userData === null) {
    return null
  }
  return (
    <div className={hstack()}>
      <p>{userData?.email}</p>
      <Button variant="white" onClick={() => clearUser()}>
        Logout
      </Button>
    </div>
  )
}

export default UserWidget

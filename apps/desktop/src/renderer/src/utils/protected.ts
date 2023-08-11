import { useUserStore } from '@renderer/store/user'
import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const ProtectedView = (props: PropsWithChildren) => {
  const navigate = useNavigate()
  const { user } = useUserStore()

  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
  }, [user])

  return props.children
}

import { useUserStore } from '@renderer/store/user'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const { user } = useUserStore()
  const navigate = useNavigate()

  // TODO: restore session from local JWT key store

  useEffect(() => {
    navigate('/today')
  }, [user])

  // TODO: put placeholder here
  return null
}
export default HomePage

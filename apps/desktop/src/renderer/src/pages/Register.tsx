// import Button from '@renderer/components/Button'
import { account } from '@renderer/services/appwrite'
import { css, cx } from '@styled-system/css'
import { container, vstack } from '@styled-system/patterns'
import { useState } from 'react'
import { UserSession, useUserStore } from '@renderer/store/user'
import { useNavigate } from 'react-router-dom'
import {Button} from '@supernova/ui'

interface Props {
  submitCallback?: (user: UserSession) => void
}

const RegisterPage = ({ submitCallback }: Props) => {
  const { updateUser } = useUserStore()
  const [{ email, password, reenterPassword }, setDetails] = useState<{
    email: string
    password: string
    reenterPassword: string
  }>({
    email: '',
    password: '',
    reenterPassword: ''
  })
  const [error, setError] = useState<{ message: string } | null>(null)
  const navigate = useNavigate()

  return (
    <form
      className={cx(
        container({
          bg: 'white',
          color: 'black',
          p: '1rem',
          width: 'min-content',
          rounded: 'sm',
          h: 'full'
        }),
        vstack()
      )}
      onSubmit={async (ev) => {
        ev.preventDefault()
        try {
          await account.createEmailSession(email, password)
          const user = await account.get()
          updateUser(user)
          if (submitCallback) submitCallback(user)
          navigate('/today') // go to today
        } catch (err) {
          setError({ message: 'Incorrect email or password. Please try again' })
        }
      }}
    >
      <h1 className={css({ fontSize: 'xl' })}>Register</h1>
      <label htmlFor="email-register">
        <p>Email</p>
      </label>
      <input
        value={email}
        className={css({ border: 'thin solid black', rounded: 'sm', p: 2, fontSize: 'medium' })}
        id="email-register"
        name="email-register"
        type="email"
        placeholder="e.g person@gmail.com"
        onChange={(ev) => {
          setDetails((prev) => ({ ...prev, email: ev.target.value }))
        }}
      />
      <input
        value={password}
        className={css({ border: 'thin solid black', rounded: 'sm', p: 2, fontSize: 'medium' })}
        type="password"
        placeholder="Something secure..."
        onChange={(ev) => {
          setDetails((prev) => ({ ...prev, password: ev.target.value }))
        }}
      />
      <input
        value={reenterPassword}
        className={css({ border: 'thin solid black', rounded: 'sm', p: 2, fontSize: 'medium' })}
        type="password"
        placeholder="Re-enter your password"
        onChange={(ev) => {
          setDetails((prev) => ({ ...prev, password: ev.target.value }))
        }}
      />
      {error && <p className={css({ color: 'red.500', textAlign: 'center' })}>{error.message}</p>}
      <Button type="submit">
        Submit
      </Button>
      <Button
        variant="ghost"
        type="button"
        onClick={(ev) => {
          ev.preventDefault()
          navigate('/login')
        }}
      >
        <p className={css({ color: 'blue.500' })}>Login instead</p>
      </Button>
    </form>
  )
}

export default RegisterPage

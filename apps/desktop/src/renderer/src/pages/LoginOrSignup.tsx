import Button from '@renderer/components/Button'
import { account } from '@renderer/services/appwrite'
import { css, cx } from '@styled-system/css'
import { container, hstack, vstack } from '@styled-system/patterns'
import React, { useState } from 'react'
import { UserSession, useUserStore } from '@renderer/store/user'
import { useNavigate } from 'react-router-dom'

interface Props {
  submitCallback?: (user: UserSession) => void
}

const LoginOrSignupPage: React.FC<Props> = ({ submitCallback }) => {
  const { updateUser } = useUserStore()
  const [{ email, password }, setDetails] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<{ message: string } | null>(null)
  const navigate = useNavigate()

  return (
    <form
      className={cx(
        container({
          bg: 'white',
          color: 'black',
          px: '2rem',
          py: '2rem',
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
      <h1 className={css({ fontSize: 'xl' })}>Login</h1>
      <input
        value={email}
        className={css({ border: 'thin solid black', rounded: 'sm', p: 2, fontSize: 'medium' })}
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
      {error && <p className={css({ color: 'red.500', textAlign: 'center' })}>{error.message}</p>}
      <Button variant="black" type="submit">
        Submit
      </Button>
      <div className={hstack({ gap: '3' })}>
        <hr className={css({ width: 3, color: 'gray.300', w: '12' })} />
        <p>or</p>
        <hr className={css({ width: 3, color: 'gray.300', w: '12' })} />
      </div>
      <Button
        type="button"
        variant="black"
        onClick={(ev) => {
          ev.preventDefault()
          account.createOAuth2Session('google')
        }}
      >
        Sign in with Google
      </Button>
      <Button
        variant="ghost"
        type="button"
        onClick={(ev) => {
          ev.preventDefault()
          navigate('/register')
        }}
      >
        <p className={css({ color: 'blue.500' })}>Sign up instead</p>
      </Button>
    </form>
  )
}

export default LoginOrSignupPage

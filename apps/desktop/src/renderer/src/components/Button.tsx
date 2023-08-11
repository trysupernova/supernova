import { ButtonHTMLAttributes } from 'react'
import { cva } from '@styled-system/css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'white' | 'black' | 'ghost'
}

export const Button = ({ children, variant = 'white', ...props }: Props) => {
  return (
    <button {...props} className={buttonStyle({ variant })}>
      {children}
    </button>
  )
}

export default Button

export const buttonStyle = cva({
  base: {
    borderRadius: 'xl',
    cursor: 'pointer',
    padding: '8px 15px'
  },
  variants: {
    variant: {
      white: {
        backgroundColor: 'white',
        color: 'black'
      },
      black: {
        backgroundColor: 'black',
        color: 'white'
      },
      ghost: {
        background: 'transparent',
        padding: 0
      }
    }
  }
})

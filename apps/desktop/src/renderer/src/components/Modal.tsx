import { Content, Overlay, Portal, Root } from '@radix-ui/react-dialog'
import { css } from '@styled-system/css'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  isOpen?: boolean
  onOpenChange?: (newVal: boolean) => void
  triggerChildren?: React.ReactNode
}

const Modal = (props: Props) => {
  if (!props.isOpen) {
    return null
  }

  return (
    <Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Portal>
        <Overlay className={css({ position: 'fixed', inset: 0, bg: 'black', opacity: 0.5 })} />
        <Content
          className={css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          })}
        >
          {props.children}
        </Content>
      </Portal>
    </Root>
  )
}

export default Modal

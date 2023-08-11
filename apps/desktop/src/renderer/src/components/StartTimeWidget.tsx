import { css } from '@styled-system/css'
import { container } from '@styled-system/patterns'
import moment from 'moment'

interface Props {
  time: Date
}

const StartTimeWidget = (props: Props) => {
  return (
    <div
      className={container({
        border: 'thin solid',
        borderColor: 'gray.600',
        rounded: 'md',
        px: '3px'
      })}
    >
      <p className={css({ fontSize: 'sm' })}>{moment(props.time).format('HH:mm')}</p>
    </div>
  )
}

export default StartTimeWidget

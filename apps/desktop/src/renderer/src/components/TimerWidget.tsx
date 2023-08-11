import { css } from '@styled-system/css'

interface Props {
  minutes?: number
}

export const TimerWidget = (props: Props) => {
  return (
    <span
      className={css({
        bg: 'gray.700',
        justifySelf: 'end',
        rounded: 'sm',
        padding: '2px 4px',
        fontSize: 'small',
        alignSelf: 'start'
      })}
    >
      {props.minutes
        ? Math.floor(props.minutes / 60) +
          ':' +
          (props.minutes % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2
          })
        : '-:--'}
    </span>
  )
}

export default TimerWidget

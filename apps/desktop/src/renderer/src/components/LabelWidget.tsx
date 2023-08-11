import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import { TagIcon } from 'lucide-react'

interface Props {
  title: string
  color?: string
}

const LabelWidget = (props: Props) => {
  return (
    <div
      className={hstack({
        color: props.color ?? 'gray.400',
        gap: 1,
        alignItems: 'center',
        filter: 'brightness(0.5)'
      })}
    >
      <TagIcon width={12} /> <p className={css({ fontSize: 'sm' })}>{props.title}</p>
    </div>
  )
}

export default LabelWidget

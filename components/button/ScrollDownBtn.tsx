import { themeColor } from '../../styles/theme'
import IconBtn from '../common/IconBtn'
import DownArrowIcon from '../icons/DownArrowIcon'

export default function ScrollDownBtn() {
  return (
    <IconBtn
      aria-label="scroll-down"
      onClick={() =>
        document
          .querySelector('.recentPost-link')
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    >
      <DownArrowIcon fill={`${themeColor.text1}`} />
    </IconBtn>
  )
}

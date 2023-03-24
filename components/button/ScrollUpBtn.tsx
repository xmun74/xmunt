import { themeColor } from '../../styles/theme'
import IconBtn from '../common/IconBtn'
import UpArrowIcon from '../icons/UpArrowIcon'

export default function ScrollUpBtn() {
  return (
    <IconBtn
      aria-label="scroll-up"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <UpArrowIcon fill={`${themeColor.text1}`} />
    </IconBtn>
  )
}

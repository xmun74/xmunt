import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

/** "2026. 6. 23. 월" 형식의 한글 날짜 문자열 */
const formatPostDate = (date: string) => dayjs(date).format('YYYY. M. D. ddd')

export default formatPostDate

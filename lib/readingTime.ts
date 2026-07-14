/**
 * 마크다운 본문에서 예상 읽기 시간(분)을 계산한다.
 * 코드블록은 읽는 속도가 달라 제외하고, 한글 기준 분당 약 500자로 계산.
 */
const CHARS_PER_MINUTE = 500

const getReadingMinutes = (content: string): number => {
  const stripped = content
    .replace(/```[\s\S]*?```/g, '') // 코드블록 제외
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 이미지 문법 제외
    .replace(/[#>*`~\-[\]()_|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return Math.max(1, Math.round(stripped.length / CHARS_PER_MINUTE))
}

export default getReadingMinutes

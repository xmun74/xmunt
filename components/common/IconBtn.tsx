import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const IconBtnContainer = styled.button`
  border: none;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: transparent;
  transition: background 160ms ease;
  &:hover {
    background: ${themeColor.hoverBg};
  }
  @media screen and (max-width: 767px) {
    width: 2rem;
    height: 2rem;
  }
`
export default function IconBtn({
  children,
  onClick,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <IconBtnContainer
      aria-label="icon-button"
      type="button"
      {...props}
      onClick={onClick}
    >
      {children}
    </IconBtnContainer>
  )
}

import styled from 'styled-components'

const IconBtnContainer = styled.button`
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 15px;
  &:hover {
    background-color: #cad0d97a;
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

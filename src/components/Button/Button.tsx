import { ButtonContainer, ButtonVariant } from './styles'

interface ButtonProps {
  color?: ButtonVariant
}

export const Button = ({ color }: ButtonProps) => {
  return <ButtonContainer variant={color}>Enviar</ButtonContainer>
}

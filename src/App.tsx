import { ThemeProvider } from 'styled-components'
import { Button } from './components/Button/Button'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'

export const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <Button color="primary" />
      <Button color="secondary" />
      <Button color="danger" />
      <Button color="success" />
      <Button />
    </ThemeProvider>
  )
}

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import App from './App.tsx'
import { GlobalStyle, theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
)

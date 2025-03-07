import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// SCSS main import
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

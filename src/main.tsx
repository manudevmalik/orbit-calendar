import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { AppearanceProvider } from './context/AppearanceContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppearanceProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AppearanceProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </LanguageProvider>
  </StrictMode>,
)

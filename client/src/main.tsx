import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SearchProvider } from "./Components/Search";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchProvider>
<App/>
    </SearchProvider>
    
  </StrictMode>,
)

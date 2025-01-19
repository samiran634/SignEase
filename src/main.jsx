import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
const PUBLISHABLEKEY=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLEKEY)alert("please set your publishable key");
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLEKEY}>
    <App />
    </ClerkProvider>
  
  </StrictMode>,
)

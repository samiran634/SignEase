import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark, neobrutalism } from '@clerk/themes'
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!clerkPubKey)alert("please set your publishable key");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}
    appearance={{ baseTheme: neobrutalism}}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)

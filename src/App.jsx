import { useState } from 'react'
import './App.css'
import { LandingPage } from './components/landing/LandingPage'
import { SignIn } from '@clerk/clerk-react'

function App() {
   

  return (
    <>  
      <LandingPage />
    </>
  )
}

export default App

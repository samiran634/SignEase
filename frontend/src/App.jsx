import './App.css'
import  { LandingPage } from './components/landing/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/user/login'
import MainPage from './components/loccked_components/mainpage'
import AboutPage from './components/common/about'
import PreviousPage from './components/loccked_components/previous'
import OngoingPage from './components/loccked_components/ongoing'

function App() {
  return (
    < BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/previous" element={<PreviousPage />} />
        <Route path="/ongoing" element={<OngoingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

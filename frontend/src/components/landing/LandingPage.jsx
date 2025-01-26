import React, { useState, useEffect } from 'react'
import { NavBar } from './NavBar'
import { HeroImage } from './HeroImage'
import { HeroContent } from './HeroContent'
import Login from '../user/login'
 import Lenis from 'lenis'
 import RollerBackground from './roller'
 import {useUser } from 
 "@clerk/clerk-react";
 import MainPage from '../loccked_components/mainpage'
import {AboutPage} from '../about'

export const LandingPage = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [showMain, setShowMain] = useState(false);
  const [showRoller, setShowRoller] = useState(false);
  const user= useUser().user;


  useEffect(() => {
    const handleScroll = () => {
      if (!showMain) {
        setShowMain(true);
      }
      if (!showRoller && window.scrollY > 100) { 
        setShowRoller(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showMain, showRoller]);

  // Initialize Lenis
const lenis = new Lenis({
  duration:5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
}
);

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
console.log(user);

requestAnimationFrame(raf);
if(!user){
//  alert("1 condition encountered")
  const navItems = [
    {
      text: "Login",
      onClick: () => setCurrentView('login'),
      ariaLabel: "login"
    },
    {
      text: "About",
      onClick: () =>  setCurrentView("about"),
      ariaLabel: "about"
    }
  ]
  return (
    <div
      className="flex flex-col pt-10 py-10 px-10 w-full min-h-screen max-md:px-5 max-md:max-w-full font-irish-grover"
    >
      {currentView === 'landing' && (
        <>
          <NavBar siteName="business_automation" navItems={navItems} />
          <header className="flex flex-wrap gap-10 mt-5 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            <HeroImage
              src="/hero_image.png"
              alt="hero_image"
            />
            <HeroContent
              title=" Manage Your Business faster"
              subtitle="understand and make deal with AI"
              titleId="understand and make deal with AI"
            />
          </header>
          <main className={`mt-10 ${showRoller ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
            <RollerBackground/>
          </main>
        </>
      )}
      {currentView === 'login' && <Login/>}
      {currentView==="about"&&<AboutPage/>}
    </div>
  )
}else if(user) {
  // alert("2 condition encountered")
  return(<MainPage/>)
}else {
  alert("please login")
}
}

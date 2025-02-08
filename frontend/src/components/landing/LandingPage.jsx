import React, { useState, useEffect, useRef } from 'react'
import { NavBar } from '../common/NavBar'
import { HeroImage } from './HeroImage'
import { HeroContent } from './HeroContent'
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis'
import RollerBackground from './roller'
import {useUser} from 
"@clerk/clerk-react";

export const LandingPage = () => {
  const navigate = useNavigate();
const navItems = [
  {
    text: "Login",
    onClick: () => navigate('/login'),
    ariaLabel: "login"
  },
  {
    text: "About",
    onClick: () => navigate('/about'),
    ariaLabel: "about"
  }
]

 
  const [showMain, setShowMain] = useState(true);
  const [showRoller, setShowRoller] = useState(false);
  const user= useUser().user;
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [mainOpacity, setMainOpacity] = useState(0);

  useEffect(() => {
    if(user){
      navigate('/home');
    }
  }, [user,navigate]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = headerHeight * 0.5;

      if (scrollY <= threshold) {
        const opacity = 1 - (scrollY / threshold);
        setHeaderOpacity(opacity);
        setMainOpacity(0);
      } else {
        setHeaderOpacity(0);
        setMainOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  useEffect(() => {
    const handleScroll = () => {
      if (showMain&&window.scrollY > 100) {
        setShowMain(false);
      }
      if(!showMain&&window.scrollY <= 100) {
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
}
);

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
console.log(user);

requestAnimationFrame(raf);
 

  return (
    <div
      className="flex flex-col pt-10 py-10 px-10 w-full min-h-screen max-md:px-5 max-md:max-w-full font-irish-grover"
    >
          <NavBar siteName="signEase" navItems={navItems} />
          <header
            ref={headerRef}
            style={{ opacity: headerOpacity }}
            className={`flex flex-wrap gap-10 mt-5 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl ${showRoller ? 'opacity-0 transition-opacity duration-1000' : 'opacity-100'}`}
          >
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
          <main style={{ opacity: mainOpacity }} className={`mt-10 ${showRoller ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}`}>
            <RollerBackground/>
          </main>
    </div>
  )
 
}

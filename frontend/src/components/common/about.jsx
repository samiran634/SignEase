import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from './NavBar';
  const AboutPage=()=>{
    const navigate=useNavigate();
    const navItems = [
        {
            text:"home",
            onClick: () =>  navigate('/home'),
            ariaLabel: "home"
        },
        {
          text: "profile",
          onClick: () => navigate('/profile'),
          ariaLabel: "profile"
        },
        {
          text: "About",
          onClick: () =>  navigate('/about'),
          ariaLabel: "about"
        }
      ]
 
    return(
        <div className='h-screen w-screen bg-white flex flex-col'>
            <NavBar siteName={"siginEase"} navItems={navItems} className ="w-screen"/>
            <h1 className='text-zinc-600 '>About Page</h1>
        </div>
    )
}   
export default AboutPage;
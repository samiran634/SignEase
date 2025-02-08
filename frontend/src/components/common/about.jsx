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
        <div>
            <NavBar navItems={navItems}/>
            <h1>About Page</h1>
        </div>
    )
}   
export default AboutPage;
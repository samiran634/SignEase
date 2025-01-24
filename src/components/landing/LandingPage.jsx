import React from 'react'
import { NavBar } from './NavBar'
import { HeroImage } from './HeroImage'
import { HeroContent } from './HeroContent'
import { SignIn } from '@clerk/clerk-react'
export const LandingPage = () => {
  const navItems = [
    {
      text: "Login",
      onClick: () => <SignIn />,
      ariaLabel: "login"
    },
    {
      text: "About",
      onClick: () => console.log("about clicked"),
      ariaLabel: "about"
    }
  ]

  return (
    <div 
      className="flex flex-col px-7 pt-16 w-full min-h-screen max-md:px-5 max-md:max-w-full font-irish-grover"
      style={{
        background: 'conic-gradient(from 180deg at 50% 50%, #0E269E 225.3690505027771deg, #050D38 346.70130729675293deg)'
      }}
    >
      <NavBar siteName="business_automation" navItems={navItems} />
      <main className="flex flex-wrap gap-10 mt-48 text-5xl text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
        <HeroImage
          src="/assets/hero_image.png"
          alt="hero_image"
        />
        <HeroContent
          title="Automate Your Business"
          subtitle="Automate Your Business"
          titleId="main-hero-title"
        />
      </main>
    </div>
  )
}

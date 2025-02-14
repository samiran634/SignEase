import React from 'react'

export const NavBar = ({ siteName, navItems }) => {
  return (
    <nav className="flex justify-between items-center w-full mt-4  ">
      <div className="text-white text-2xl font-bold bg-black h-12 w-15 mx-20 rounded-xl flex justify-center items-center px-4">
        {siteName}
      </div>
      <div className="flex gap-6">
        {navItems.map((item, index) => (
          <button
            key={index} 
            onClick={item.onClick}
            aria-label={item.ariaLabel}
            className="text-white hover:text-gray-300 transition-colors"
          >
            {item.text}
          </button>
        ))}
      </div>
    </nav>
  )
}

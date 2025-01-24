import React from 'react'

export const NavBar = ({ siteName, navItems }) => {
  return (
    <nav className="flex justify-between items-center w-full">
      <div className="text-white text-2xl font-bold">
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

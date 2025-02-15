import React, { useState } from 'react';

export const NavBar = ({ siteName, navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (onClick) => {
    onClick();
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex justify-between items-center w-full mt-4 relative sticky top-0 bg-transparent z-9999">
      <div className="text-white text-2xl font-bold bg-black h-12 w-15 mx-20 rounded-xl flex justify-center items-center px-4 z-9999">
        {siteName}
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90 flex flex-col items-center justify-end transition-transform duration-300 ${isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'} md:transform-none md:relative md:flex-row md:bg-transparent md:gap-6 z-10`}>
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuItemClick(item.onClick)}
            aria-label={item.ariaLabel}
            className="text-white hover:text-gray-300 transition-colors max-md:mt-2 mr-4"
          >
            {item.text}
          </button>
        ))}
      </div>
    </nav>
  );
};

import React, { useState, useEffect } from 'react';

export const NavBar = ({ siteName, navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (onClick) => {
    onClick();
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex justify-between items-center w-full mt-6 sticky top-0 bg-transparent z-50 text-white">
      {/* Logo/Site Name */}
      <div className="text-white text-xl sm:text-2xl font-bold bg-black h-10 sm:h-12 rounded-xl flex items-center px-4">
        {siteName}
      </div>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center z-50 mt-2">
        <button 
          onClick={toggleMenu} 
          className=" p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>
      
      {/* Desktop Navigation Items */}
      <div className="hidden md:flex md:items-center md:gap-6">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuItemClick(item.onClick)}
            aria-label={item.ariaLabel}
            className="  hover:text-gray-600 font-medium transition-colors px-4 py-2"
          >
            {item.text}
          </button>
        ))}
      </div>
      
      {/* Mobile Navigation Menu - Separate from desktop navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div className="  text-xl font-bold">{siteName}</div>
          
          </div>
          
          <div className="flex flex-col p-6 gap-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.onClick)}
                aria-label={item.ariaLabel}
                className=" text-lg font-medium hover:text-gray-600 transition-colors py-3 border-b border-gray-200"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
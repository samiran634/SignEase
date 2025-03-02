import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const VerticalCard = ({ title, subtitle, text, image }) => {
    const navigate = useNavigate();
  // Default image if none provided
  const cardImage = image || 'https://images.unsplash.com/photo-1593642532937-7f5f5f2b1a1e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl mx-auto flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl">
      {/* Image section - full width on mobile, 40% on desktop */}
      <div 
        className="bg-cover bg-center h-94 md:h-auto md:w-2/5 relative"
        style={{ backgroundImage: `url('${cardImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-end">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      
      {/* Content section - full width on mobile, 60% on desktop */}
      <div className="p-6 md:w-4/5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{subtitle}</h3>
          <p className="text-gray-600 leading-relaxed">{text}</p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300" onClick={() => navigate('/login')}>
           logIn to experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalCard;
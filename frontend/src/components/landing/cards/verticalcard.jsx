import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CardDefault({ Title, SubTitle, Image }) {
  const navigate = useNavigate();
   

  

  return (
    <div
      className={`w-[16em] h-[22em] perspective-1000 cursor-pointer bg-white/80 `}
      
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 `}
      >
        {/* Front of the card */}
        <div
          className={`absolute w-full h-full backface-hidden`}
        >
          <img className="w-full h-48 object-cover" src={Image} alt="Card" />
          <div className="p-5 flex flex-col justify-between h-[calc(100%-12rem)]">
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
              {Title}
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {SubTitle}
            </p>
            <button
              className="mt-auto inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border rounded-2xl h-10 w-30 
                         hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 
                         transition-all duration-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              onClick={() => navigate("/")}
            >
              Read more
              <svg
                className="w-4 h-4 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Back of the card */}
        
      </div>
    </div>
  );
}
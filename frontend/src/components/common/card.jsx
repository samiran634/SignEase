import React from "react";
import cool_background from "../../assets/cool_background.png";
import { useNavigate } from "react-router-dom";
const CardComponent=({TitleText,SubtitleText,Indecator})=>{
  const navigate =useNavigate();
    return (
        <div className="bg-white w-60 p-2 rounded-xl transition-all hover:-translate-y-2 duration300 shadow-lg hover:shadow-2xl">
          <img className="rounded-xl object-cover h-40" src={cool_background} alt="Background" />

          <div className="p-2">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
               {TitleText?TitleText:"Noteworthy technology acquisitions 2021"}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm">
             {
                SubtitleText?SubtitleText:" Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
             }
            </p>
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => navigate({
                pathname: '/read',
                search: `?key=${Indecator}`
              })}
            >
              Read more
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          </div>
        </div>
    )
}

export default CardComponent
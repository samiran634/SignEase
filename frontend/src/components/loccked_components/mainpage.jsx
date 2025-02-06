import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "../common/NavBar";
import  talk_human from "../../assets/human/talk_human.png";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return (<RedirectToSignIn />);
  }

  const navItems = [
    {
      text: "profile",
      onClick: () => navigate('/profile'),
      ariaLabel: "login"
    },
    {
      text: "About",
      onClick: () => navigate("/about"),
      ariaLabel: "about"
    }
  ];

  document.body.style.backgroundColor = 'white';
  document.body.style.backgroundImage = `url(${talk_human})`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "contain";
  document.body.style.backgroundPositionY = "center";
  document.body.style.backgroundAttachment = "fixed";

  return (
    <>
      <nav className="absolute top-0 w-[90vw] my-4 mr-20"><NavBar siteName="business_automation" navItems={navItems} /></nav>
      <div className="main-container w-[70%] bg-transparent absolute overflow-hidden mx-auto top-4 right-0 px-6 flex flex-wrap gap-8 pt-10 mt-[6em]">
        <div className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-zinc-800">
          <div className="px-6 py-4">
            <div className="text-black font-bold text-xl mb-2">Previous Contracts</div>
            <p className="text-gray-700 text-base">
              You will find all your previous contracts here. Those are mainly those which are signed or expired.
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <a onClick={() => navigate('/previous')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800">
              Let's Go
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
        <div className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-zinc-500">
          <div className="px-6 py-4">
            <div className="text-black font-bold text-xl mb-2">ongoing Contracts</div>
            <p className="text-gray-700 text-base">
              You will find all your ongoing contracts here. Those are mainly those which are not yet signed or not expired.
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <a onClick={() => navigate('/ongoing')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Let's Go
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
        <div className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-zinc-800">
          <div className="px-6 py-4">
            <div className="text-black font-bold text-xl mb-2">add new Contract</div>
            <p className="text-gray-700 text-base">
              drag and drop new file document or upload form local mechine
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <a onClick={() => navigate('/contracts')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Let's Go
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
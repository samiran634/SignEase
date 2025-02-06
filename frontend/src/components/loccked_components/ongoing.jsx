import React from "react";
import docs_background from "../../assets/human/docs_background.png";
import { NavBar } from "../common/NavBar";
import { useNavigate } from 'react-router-dom';
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

export default function OngoingPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const navItems = [
    {
      text: "home",
      onClick: () => navigate('/home'),
      ariaLabel: "home"
    },
    {
      text: "profile",
      onClick: () => navigate('/profile'),
      ariaLabel: "profile"
    },
    {
      text: "About",
      onClick: () => navigate('/about'),
      ariaLabel: "about"
    }
  ];

  return (
    <div style={{ 
      backgroundImage: `url(${docs_background})`, 
      backgroundRepeat: "no-repeat", 
      backgroundSize: "contain", 
      backgroundPosition: "center", 
      backgroundAttachment: "fixed",
      width: '100vw',
      height: '100vh'
    }}>
      <div className="main-container w-screen h-screen relative overflow-hidden mx-auto my-0 z-index-99">
        <div className="flex w-[548px] h-[67px] justify-between items-center relative z-[18] mt-[24px] mr-0 mb-0 ml-[845px]">
          <NavBar navItems={navItems} />
        </div>
        <button className="w-[492px] h-[111px] bg-[#d9d9d9] rounded-[57px] border-none relative z-[5] pointer mt-[41px] mr-0 mb-0 ml-[170px]">
          <span className="flex h-[39px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[41px] left-[104px] text-left whitespace-nowrap z-[5]">
            smaple contract
          </span>
        </button>
      </div>
    </div>
  );
}

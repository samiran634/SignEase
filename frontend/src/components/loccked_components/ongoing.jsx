import React from "react";
 import docs_background from "../../assets/human/docs_background.png";
 import { NavBar } from "../landing/NavBar";
 import MainPage from "./mainpage";
 

export default function Ongoing() {
    document.body.style.backgroundImage = `url(${docs_background})`;
 document.body.style.backgroundRepeat = "no-repeat";
 document.body.style.backgroundSize = "contain";
 document.body.style.backgroundPosition = "center";
 document.body.style.backgroundAttachment = "fixed";
    const [currentView, setCurrentView] = useState('ongoing');

    const navItems = [
        {
            text:"home",
            onClick: () => setCurrentView('home'),
            ariaLabel: "home"
        },
        {
          text: "profile",
          onClick: () => setCurrentView('profile'),
          ariaLabel: "login"
        },
        {
          text: "About",
          onClick: () =>  setCurrentView("about"),
          ariaLabel: "about"
        }
      ]
  return (
    <div>
        {
            currentView==="ongoing"&&(<div className="main-container w-screen h-screen  relative overflow-hidden mx-auto my-0 z-index-99">
            <div className="flex w-[548px] h-[67px] justify-between items-center relative z-[18] mt-[24px] mr-0 mb-0 ml-[845px]">
              <NavBar navItems={navItems} />
            </div>
            <button className="w-[492px] h-[111px] bg-[#d9d9d9] rounded-[57px] border-none relative z-[5] pointer mt-[41px] mr-0 mb-0 ml-[170px]">
              <span className="flex h-[39px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[41px] left-[104px] text-left whitespace-nowrap z-[5]">
                smaple contract
              </span>
            </button>
          </div>)}
          {currentView==="home"&& <MainPage/>}
    </div>
    
  );
}

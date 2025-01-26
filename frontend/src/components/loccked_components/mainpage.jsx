import { useState } from "react";
import { motion } from "framer-motion";
import talk_human from "../../assets/human/talk_human.png";
import { NavBar } from "../landing/NavBar";
import { useUser,UserProfile } from "@clerk/clerk-react";
import Ongoing from "./ongoing";
import Previous from "./previous";
import {AboutPage} from '../about'  
import HighlightPDF from "../loccked_components/add";
const MainPage=()=>{
  const [isPopedUp, setIsPopedUp]=useState(false)
const [currentView, setCurrentView] = useState('main');
 
document.body.style.backgroundColor = 'white';
document.body.style.backgroundImage = `url(${talk_human})`;
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "contain";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundAttachment = "fixed";
const navItems = [
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
return(
  <div>
    {currentView==='main'&&(<>
      <nav ><NavBar siteName="business_automation" navItems={navItems}/></nav>
  <div className="main-container opacity-[1] relative overflow-hidden mx-auto my-0">
    <div className="w-[940px] h-[318px] relative overflow-hidden z-[2] mt-[4em] mr-0 mb-0 ml-[166px] cursor-pointer" onClick={() => setCurrentView('previous')}>
      <div className="w-[54em] h-[16em] bg-[#d9d9d9] rounded-[49px] absolute top-0 left-[13px]" />
      <span className="flex w-[409px] h-[116px] justify-start items-start font-['Irish_Grover'] text-[48px] font-normal leading-[58.031px] text-[#000] absolute top-[43px] left-[53px] text-left overflow-hidden z-[2]">
        previous contracts
        <br />
      </span>
      <span className="flex h-[48px] justify-start items-start font-['Irish_Grover'] text-[40px] font-normal leading-[48px] text-[#000] absolute top-[159px] left-[53px] text-left whitespace-nowrap z-[2]">
        here you will found your expired contracts
      </span>
    </div>
    <div className="w-[934px] h-[307px] relative overflow-hidden z-[5] mt-[31px] mr-0 mb-0 ml-[176px] cursor-pointer" onClick={() => setCurrentView('ongoing')}> 
      <div className="w-[54em] h-[15em] bg-[#d9d9d9] rounded-[49px] absolute top-[11px] left-[3px] z-[6]" />
      <span className="flex h-[58px] justify-start items-start font-['Irish_Grover'] text-[48px] font-normal leading-[58px] text-[#000] absolute top-[62px] left-[52px] text-left whitespace-nowrap z-[8]">
        current contracts
      </span>
      <span className="flex h-[58px] justify-start items-start font-['Irish_Grover'] text-[48px] font-normal leading-[58px] text-[#000] absolute top-[159px] left-[57px] text-left whitespace-nowrap z-[7]">
        ongoing contracts are stored here
      </span>
    </div>
    <div className="w-[54em] h-[15em] bg-[#d9d9d9] rounded-[49px] relative z-[1] mt-[42px] mr-0 mb-0 ml-[183px] cursor-pointer" onClick={() => setCurrentView('addnew')}>
      <span  onClick={() => setIsPopedUp(true)} className="flex h-[58px] justify-start items-start font-['Irish_Grover'] text-[48px] font-normal leading-[58px] text-[#000] absolute top-[119px] left-[185px] text-left whitespace-nowrap z-[9]  cursor-pointer" >
        addnew dontracts
      </span>
    </div>
  </div>
  {isPopedUp && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-30 z-10"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg"
      >
        <HighlightPDF />
        <button
          className="absolute top-0 right-0 p-2 bg-red-500 rounded-full"
          onClick={() => setIsPopedUp(false)}
        >
          X
        </button>
      </motion.div>
    </motion.div>
  )}

  </>
)
}
{currentView === 'profile' && <div className="flex justify-center items-center h-screen   w-screen"><UserProfile /></div>}
{currentView === 'about' && <AboutPage />}
{currentView==="ongoing" && <Ongoing />}
{currentView==="previous" && <Previous />}
 
</div>
)
}
export default MainPage;
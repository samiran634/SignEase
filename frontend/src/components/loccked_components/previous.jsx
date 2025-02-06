import React,{useState} from "react";
 import cool_background from "../../assets/cool_background.png";
import { NavBar } from "../common/NavBar";
 import { useUser,UserProfile,RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

export default function PreviousPage() {
  const navigate=useNavigate();
  const user=useUser().user;
  if(!user){
   return (<RedirectToSignIn/>)
  }
    const [isClicked, setIsClicked] = useState(false);

    const navItems = [
      { 
          text:"home",
          onClick: () =>  navigate('/home'),
          ariaLabel: "home"
      },
      {
        text: "profile",
        onClick: () => navigate('/profile'),
        ariaLabel: "profile"
      },
      {
        text: "About",
        onClick: () =>  navigate('/about'),
        ariaLabel: "about"
      }
    ]
  return (
    <div>
      
        
<div className="main-container w-screen h-screen bg-[#00061c] relative overflow-hidden mx-auto my-0 px-6" style={{ backgroundImage: `url(${cool_background})`, backgroundPosition: 'right', backgroundRepeat: 'no-repeat',backgroundSize: 'contain' }}>
      <NavBar navItems={navItems} />
      <div className="w-[394px] h-[1024px] text-[0px] bg-[rgba(20,26,46,1)] absolute top-0 left-0 z-[1]">
        <span className="flex h-[39px] font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#fff] relative text-left whitespace-nowrap z-[2] mt-[1em] mr-3 mb-0 ml-[4px] border rounded-xl w-fit px-2 ">
          previous cotracts
        </span>
  
      </div>
 
      <button className="w-[425px] h-[64px] rounded-[51px] border-none absolute top-[8em] left-[30px] overflow-hidden z-[27] pointer bg-[#d9d9d9]" onClick={() => setIsClicked(!isClicked)}>
        
          <span className="flex h-[23.841px] justify-start items-start font-['Irish_Grover'] text-[2em] font-normal leading-[23.841px] text-[#0c0000] absolute top-[20.077px] left-[2em] text-left whitespace-nowrap z-[5]">
            sample contract
          </span>
       
      </button>
      
    </div>
     
    </div>
  
    );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "../common/NavBar";
import talk_human from "../../assets/human/talk_human.png";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import AddNewPdf from "./add";

const MainPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isClicked, setIsClicked] = useState(false);
 
  if (!user) {
    return <RedirectToSignIn />;
  }

  const navItems = [
    {
      text: "Profile",
      onClick: () =>  navigate("/profile"),
      ariaLabel: "profile",
    },
    {
      text:"LogOut",
      onClick:()=>navigate("/logout"),
      ariaLabel:"about",
    },
    {
      text: "About",
      onClick: () => navigate("/about"),
      ariaLabel: "about",
    },
  ];
  

  return (
    <>
      <div
        className="  h-screen w-screen bg-white   px-6 flex"
        style={{
          backgroundImage: `url(${talk_human})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPositionY: "center",
          backgroundAttachment: "fixed",
          flexDirection: "column",
        }}
      >
        <nav className="w-full sticky top-0 z-10  backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>

        <div className="flex flex-direction-column gap-6 pt-12 relative mt-20 h-[50vh] w-[70%] ml-[25em]">
          {/* Previous Contracts */}
          <div className="contract-card">
            <div className="p-5">
              <div className="text-black font-bold text-lg mb-2">
                Previous Contracts
              </div>
              <p className="text-gray-600 text-sm mb-4">
                You will find all your previous contracts here.
              </p>
              <button
                onClick={() => navigate("/previous")}
                className="contract-btn"
              >
                Let's Go
              </button>
            </div>
          </div>

          {/* Ongoing Contracts */}
          <div className="contract-card">
            <div className="p-5">
              <div className="text-black font-bold text-lg mb-2">
                Ongoing Contracts
              </div>
              <p className="text-gray-600 text-sm mb-4">
                You will find all your ongoing contracts here.
              </p>
              <button
                onClick={() => navigate("/ongoing")}
                className="contract-btn"
              >
                Let's Go
              </button>
            </div>
          </div>

          {/* Add New Contract */}
          <div className="contract-card">
            <div className="p-5">
              <div className="text-black font-bold text-lg mb-2">
                Add New Contract
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Drag and drop a new document or upload it from your device.
              </p>
              <button
                onClick={() => setIsClicked(true)}
                className="contract-btn"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>

        {/* Popup Modal for Adding New PDF */}
        {isClicked && (
          <div className="modal-backdrop">
            <div className="modal-content">
             
              <button onClick={() => setIsClicked(false)} className="close-btn top-10 right-20 absolute">
                Close
              </button>
              <AddNewPdf />
            </div>
          </div>
        )}
    
       
      </div>
    </>
  );
};

export default MainPage;

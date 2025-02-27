import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "../common/NavBar";
import talk_human from "../../assets/human/talk_human.png";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
 import { useOrganization } from "@clerk/clerk-react";
import AddNewPdf from "./add";

const MainPage = () => {
  const organization = useOrganization().organization;
  console.log("organization:", organization);
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
        className="bg-white h-screen w-screen absolute top-0 overflow-hidden"
        style={{
          backgroundImage: `url(${talk_human})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPositionY: "center",
          flexDirection: "column",
          position: "relative",  
        }}
      >
        <nav className="w-full sticky top-0 z-10 backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>

        <div className="flex flex-direction-column gap-6 pt-12 relative mt-20 h-[50vh] w-[70%] ml-[25em] sm:ml-[2em] sm:w-[50%] md:ml-[15em] lg:ml-[20em] xl:ml-[25em] 2xl:ml-[30em]"> 
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

        {/* Organization button positioned at bottom right */}
        <button 
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-shadow z-20"
          onClick={() => navigate("/dashboard")}
        >
          <img src="/organization_logo.png" alt="organization" className="w-full h-full object-cover rounded-full" />
        </button>

        {/* Popup Modal for Adding New PDF */}
        {isClicked && (
  organization?.id ? (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={() => setIsClicked(false)} className="close-btn top-10 right-20 absolute">
          Close
        </button>
        <AddNewPdf />
      </div>
    </div>
  ) : (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p className="text-red-600 font-bold">You can't upload a PDF until you join an organization.</p>
        <button onClick={() => setIsClicked(false)} className="close-btn top-10 right-20 absolute">
          Close
        </button>
      </div>
    </div>
  )
)}

      </div>
    </>
  );
};

export default MainPage;
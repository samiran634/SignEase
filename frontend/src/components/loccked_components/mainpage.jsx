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
      onClick: () => navigate("/profile"),
      ariaLabel: "profile",
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
             
              <button onClick={() => setIsClicked(false)} className="close-btn top-0 right-0">
                Close
              </button>
              <AddNewPdf isClicked={isClicked} setIsClicked={setIsClicked} />
            </div>
          </div>
        )}
      </div>

      {/* Tailwind CSS for modal styling */}
      <style>
        {`
          .contract-card {
            max-width: 280px;
            width: 60%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease-in-out;
          }
          .contract-card:hover {
            transform: scale(1.05) translateY(-5px);
            border-color: #007bff;
          }
          .contract-btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 600;
            color: white;
            background: linear-gradient(to right, #007bff, #0056b3);
            border-radius: 8px;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
          }
          .contract-btn:hover {
            background: linear-gradient(to right, #0056b3, #004494);
          }
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
          }
          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .close-btn {
            margin-top: 10px;
            padding: 8px 12px;
            font-size: 14px;
            background: red;
            color: white;
            border-radius: 6px;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default MainPage;

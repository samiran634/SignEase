import { useState } from "react";
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
      onClick: () => navigate("/profile"),
      ariaLabel: "profile",
    },
    {
      text: "LogOut",
      onClick: () => navigate("/logout"),
      ariaLabel: "about",
    },
    {
      text: "About",
      onClick: () => navigate("/about"),
      ariaLabel: "about",
    },
  ];
  
  return (
    <>
      <div className="bg-white h-[100%] w-[100%] relative mt-0">
        <nav className="w-full mt-4 backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>
        
        {/* Main content - responsive layout */}
        <div className="container mx-auto px-4 py-8">
          {/* Flex container that changes direction on small devices */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image section - full width on sm, half width on md+ */}
            <div className="w-full md:w-1/2 h-[80%]">
              <img 
                src={talk_human} 
                alt="Human talking" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            
            {/* Cards section - full width on sm, half width on md+ */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-6">  
                {/* Previous Contracts */}
                <div className="bg-white rounded-lg shadow-lg">
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
                <div className="bg-white rounded-lg shadow-lg">
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
                <div className="bg-white rounded-lg shadow-lg">
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
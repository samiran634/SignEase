import React,{useState,useEffect} from "react";

import { NavBar } from "../common/NavBar";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../common/card";
export default function PreviousPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  if (!user) {
    return <RedirectToSignIn />;
  }
  const [pdfData, setPdfData] = useState([]);
  useEffect(() => {
    async function fetchPdfs() {
      try {
        const response = await axios.get(
          `http://localhost:5000/get-files?orgId=${organization.id}type=previous`
        );
        console.log(response.data);
        setPdfData(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    }

    fetchPdfs();
  }, []);

  const navItems = [
    {
      text: "home",
      onClick: () => navigate("/home"),
      ariaLabel: "home",
    },
    {
      text: "profile",
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
    <div className="bg-white h-[100%] w-[100%] relative mt-0 flex flex-col">
      {
          pdfData.length === 0 ?(
            <>
             <NavBar siteName="signEase" navItems={navItems} />
            <div className="bg-red w-screen h-screen flex flex-col items-center justify-center">
              <h1 className="text-3xl text-black text-center">Complete your first deal to see completed contracts</h1>
              <img src="/no-data-concept-illustration.avif" alt="" />
            </div>
            </>
          ):(
            <div className="main-container w-screen h-screen bg-white relative overflow-hidden mx-auto my-0 px-6">
              <nav className="w-full sticky top-0 z-10 backdrop-blur">
                <NavBar siteName="signEase" navItems={navItems} />
              </nav>
              <CardComponent/>
       </div>
          )
        }
    </div>
     
  
     
  );
}

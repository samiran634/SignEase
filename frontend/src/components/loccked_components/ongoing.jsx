import React, { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "../common/card";
import { NavBar } from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useOrganization } from "@clerk/clerk-react";
export default function OngoingPage() {
  const navigate = useNavigate();
  const organization = useOrganization().organization;
  const { user } = useUser();
  const [pdfData, setPdfData] = useState([]);
 
  
  if (!user) {
    return <RedirectToSignIn />;
  }

  useEffect(() => {
    async function fetchPdfs() {
      try {
        const response = await axios.get(   `http://localhost:5000/get-files?orgId=${organization.id}&&type=ongoing`);
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
    <div>
      <div className="main-container w-screen h-screen bg-white relative  overflow-x-hidden mx-auto my-0 px-6 ">
        <nav className="w-full sticky top-0 z-10 backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>
       {
        pdfData.length === 0 ?(
          <>
          <div className="bg-red w-screen h-screen flex flex-row items-center justify-center">
          <div className="flex justify-center items-center h-screen text-black text-2xl font-bold">
          please join with an organization and upload you first contract
          <div className="flex justify-center items-center h-screen text-black text-2xl font-bold">
          <img src="/no-data-concept-illustration.avif" alt="" />

          </div>
         
            </div>
            
            </div>
       
          </>
          
        ) :(  
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
          {pdfData.map((pdf, index) => (
            <CardComponent 
              key={index}
              TitleText={pdf.metadata.name}  // Using dynamic title from API response
              SubtitleText="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order." 
              orgName={organization.id}
              Indecator={pdf._id}
            />
          ))}
        </div>
          
          </>
       )
       }
  
   
      </div>
    </div>
  );
}

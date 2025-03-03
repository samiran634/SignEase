import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ChatbotContainer from "./chatbot_container";
import { NavBar } from "../common/NavBar";
import PdfComp from "./pdfComp";
import { useUser, useOrganization } from "@clerk/clerk-react";
import TakeConformation from "./conformation";
export default function PdfReadandAsk() {
  const [pdfFile, setPdfFile] = useState(null);
  const [searchParams] = useSearchParams();
  const [isVisible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { organization } = useOrganization();
  const pdfId = searchParams.get("key");
  
  // Check if user is logged in
  useEffect(() => {
    if (user === null) {
      navigate("/sign-in");
    }
  }, [user, navigate]);
console.log("ingo ablut user",user);
  const navItems = [
    { text: "home", onClick: () => navigate("/home"), ariaLabel: "home" },
    { text: "profile", onClick: () => navigate("/profile"), ariaLabel: "profile" },
    { text: "About", onClick: () => navigate("/about"), ariaLabel: "about" },
  ];

  useEffect(() => {
    async function fetchPdfData() {
      if (!pdfId || !organization) return;

      try {
        const pdfUrl = `http://localhost:5000/get-file?orgName=${organization.id}&fileId=${pdfId}`;  
        console.log(pdfUrl);
        setPdfFile(pdfUrl);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    }

    fetchPdfData();
  }, [pdfId, organization]);



  return (
    <>
      <div className="w-screen h-screen bg-[#fff] mt-0 mx-auto my-0 overflow-hidden flex">
        {/* Navbar */}
        <nav className="w-full fixed top-0 z-10 backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>

        {/* PDF Viewer & Chatbot Side by Side */}
        <div className="flex w-full h-full mt-20">
          {/* PDF Section */}
          <div className="w-[70%] h-full">
            {pdfFile ? <PdfComp pdfFile={pdfFile} /> : <p>Loading PDF...</p>}
          </div>

          {/* Chatbot Section */}
          <div className="w-[30%] h-[75%] border-l border-gray-300 bg-gray-100 flex flex-col mb-0">
            <ChatbotContainer />
          </div>
        </div>

        {/* Floating Button */}
        <button
        className="fixed right-5 top-20 px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-2xl hover:bg-blue-800 flex items-center"
        onClick={() => setVisible(true)} 
      >
        Want to confirm deal?
        <svg className="w-3.5 h-3.5 ms-2" viewBox="0 0 14 10" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </button>
      
      {isVisible && <TakeConformation onClose={() => setVisible(false)} />}
      </div>
    </>
  );
}
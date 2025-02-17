import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useSearchParams } from "react-router-dom";
 import ChatbotContainer from "./chatbot_container";
 import { NavBar } from "../common/NavBar";
import PdfComp from "./pdfComp";
import { useNavigate } from "react-router-dom";
export default function PdfReadandAsk() {
  const [pdfData, setPdfData] = useState(null);  
  const [searchParams] = useSearchParams();  
  const [pdfFile, setPdfFile] = useState(null);
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
  // Extract query parameter (assuming ?key=some_value in URL)
  const pdfId = searchParams.get("key");
const navigate=useNavigate();
  useEffect(() => {
    async function fetchPdfData() {
      if (!pdfId) return; // Prevent request if pdfId is null

      try {
        const response = await axios.get(`http://localhost:5000/get-file?key=${pdfId}`);
        
        if (response.data?.data) {
          setPdfData(response.data.data);
          const fileUrl = encodeURI(`http://localhost:5000/files/${response.data.data.pdf}`);
          console.log(fileUrl);
          setPdfFile(fileUrl);
          
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    }

    fetchPdfData();
  }, [pdfId]); // Re-fetch when pdfId changes

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
          <div className=" w-[70%] h-full">
            {pdfFile ? <PdfComp pdfFile={pdfFile} /> : <p>Loading PDF...</p>}
          </div>
  
          {/* Chatbot Section (Fixing Visibility) */}
          <div className="w-[30%] h-[75%] border-l border-gray-300 bg-gray-100 flex flex-col mb-0">
            <ChatbotContainer />
          </div>
        </div>
  
        {/* Floating Button */}
        <button
          className="fixed right-5 top-20 px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-2xl hover:bg-blue-800"
          onClick={() => navigate({ pathname: "/read" })}
        >
          Want to confirm deal?
          <svg className="w-3.5 h-3.5 ms-2" viewBox="0 0 14 10" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </button>
      </div>
    </>
  );
  
}

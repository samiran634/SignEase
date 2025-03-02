import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import ChatbotContainer from "./chatbot_container";
import { NavBar } from "../common/NavBar";
import PdfComp from "./pdfComp";
import { useUser,useOrganization } from "@clerk/clerk-react";
export default function PdfReadandAsk() {
  const [pdfFile, setPdfFile] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser().user;
  const organization=useOrganization().organization;
  if(user===null){
    navigate("/sign-in");
  }
  const pdfId = searchParams.get("key");
  const [isVisable, setvisable] = useState(false);
  const navItems = [
    { text: "home", onClick: () => navigate("/home"), ariaLabel: "home" },
    { text: "profile", onClick: () => navigate("/profile"), ariaLabel: "profile" },
    { text: "About", onClick: () => navigate("/about"), ariaLabel: "about" },
  ];

  useEffect(() => {
    async function fetchPdfData() {
      if (!pdfId) return;

      try {
        const pdfUrl = `http://localhost:5000/get-file?orgName=${organization.id}&fileId=${pdfId}`;  
        console.log(pdfUrl);
        setPdfFile(pdfUrl);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    }

    fetchPdfData();
  }, [pdfId]);
async function handleClick() {
  setvisable(!isVisable)
  const response = await axios.post(`http://localhost:8080/send-envelope`, {


});
console.log("Chatbot Response:", response.data);
if(response.data==="success"){
  setTimeout(() => {
    setvisable(false);
  }, 5000);
}
}
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
          className="fixed right-5 top-20 px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-2xl hover:bg-blue-800"
          onClick={() => handleClick()} 
        >
          Want to confirm deal?
          <svg className="w-3.5 h-3.5 ms-2" viewBox="0 0 14 10" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </button>
        {isVisable &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-medium">Thank you!</h5>
              <button onClick={() => setvisable(!isVisable)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-black">Thank you for your interest in our product.<br/><strong>Please check your email to confirm the deal.</strong> </p>
           
          </div>
        </div>
        }
      </div>
    </>
  );
}

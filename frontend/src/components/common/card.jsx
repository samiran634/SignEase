import React, { useState, useEffect } from "react";
import axios from "axios";
import cool_background from "../../assets/cool_background.png";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ TitleText, SubtitleText, Indecator }) => {
  const navigate = useNavigate();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function fetchPdfData() {
      if (!Indecator) return;

      try {
        const response = await axios.get(`http://localhost:5000/get-file/${Indecator}`, {
          responseType: "blob",
        });

        console.log("Fetched PDF Blob:", response.data);
        setPdfBlob(response.data);

        // ✅ Fixed URL Construction
        const blobUrl = `http://localhost:5000/get-file/${Indecator}`;
        setPdfUrl(blobUrl);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    }

    fetchPdfData();
  }, [Indecator]);

  async function sendRequest() {
    if (!pdfBlob) {
      console.error("No PDF file available.");
      return;
    }

    try {
      const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", pdfFile);

      console.log("Uploading PDF:", formData.get("pdf"));

      const uploadResponse = await axios.post("http://localhost:8080/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File upload response:", uploadResponse.data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  }

  const handleReadMore = async () => {
    if (!pdfBlob) {
      console.error("PDF not ready yet. Please wait...");
      return;
    }

    await sendRequest();
    navigate({ pathname: "/read", search: `?key=${Indecator}` });
  };

  return (
    <div className="bg-white w-full sm:w-60 p-4 rounded-xl transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
      <img className="rounded-xl object-cover h-40 w-full" src={cool_background} alt="Background" />

      <div className="p-2">
        <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {TitleText || "Noteworthy technology acquisitions 2021"}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm">
          {SubtitleText || "Biggest enterprise technology acquisitions of 2021."}
        </p>

        {/* Open PDF in a new tab */}
        {pdfUrl && (
          <button
            className="w-full flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800"
            onClick={handleReadMore}
          >
            Read more
            <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CardComponent;

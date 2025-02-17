import React, { useState, useEffect } from "react";
import axios from "axios";
import cool_background from "../../assets/cool_background.png";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ TitleText, SubtitleText, Indecator }) => {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    async function fetchPdfData() {
      if (!Indecator) return; // Prevent request if Indecator is null

      try {
        const response = await axios.get(`http://localhost:5000/get-file?key=${Indecator}`);

        if (response.data?.data) {
          const pdfList = response.data.data; // Assuming data is an array

          // Ensure it's an array and find the correct PDF
          const selectedPdf = Array.isArray(pdfList)
            ? pdfList.find(pdf => pdf.name === Indecator) // Assuming PDF objects have a `name` property
            : pdfList; // If it's already a single object

          if (selectedPdf) {
            const filePath = encodeURI(`http://localhost:5000/files/${selectedPdf.pdf}`);
            console.log("File Path:", filePath);
            setPdfFile(filePath);
          } else {
            console.error("PDF with matching Indecator not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    }

    fetchPdfData();
  }, [Indecator]);

  async function sendRequest() {
    if (!pdfFile) {
      console.error("No PDF file available.");
      return;
    }

    try {
      // Fetch the PDF file as a Blob
      const response = await fetch(pdfFile);
      const blob = await response.blob(); // Convert to Blob

      // Create FormData
      const formData = new FormData();
      formData.append("file", blob, "document.pdf"); // Provide filename

      // Send the request with the correct headers
      const uploadResponse = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File upload response:", uploadResponse.data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  }

  return (
    <div className="bg-white w-60 p-2 rounded-xl transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
      <img className="rounded-xl object-cover h-40" src={cool_background} alt="Background" />

      <div className="p-2">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {TitleText || "Noteworthy technology acquisitions 2021"}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm">
          {SubtitleText ||
            "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."}
        </p>
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            navigate({ pathname: "/read", search: `?key=${Indecator}` });
            sendRequest();
          }}
        >
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardComponent;

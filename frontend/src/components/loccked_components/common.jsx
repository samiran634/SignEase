import React from "react";
 
import chatbot_container from "./chatbot_container";
export default function PdfReadandAsk() {
  return (
    <div className="main-container w-screen h-screen bg-[#fff] relative overflow-hidden mx-auto my-0">
      <div className="w-[654px] h-[1386px] text-[0px] bg-[#d9d9d9] relative mt-0 mr-0 mb-0 ml-0">
        <span className="block h-[58px] font-['Irish_Grover'] text-[48px] font-normal leading-[58px] text-[#000] relative text-left whitespace-nowrap z-[1] mt-[348px] mr-0 mb-0 ml-[106px]">
          pdf file read section
        </span>
       
      </div>
      <chatbot_container/>
    </div>
  );
}

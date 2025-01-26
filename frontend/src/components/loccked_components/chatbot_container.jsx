import React from "react";
 

export default function chatbot_container() {
  return (
    <div className="main-container w-[680px] h-[927px] rounded-[2px] relative overflow-hidden mx-auto my-0">
      <div className="w-[64px] h-[65px] bg-[#d9d9d9] rounded-[20px] relative z-[5] mt-[35px] mr-0 mb-0 ml-[804px]" />
      <div className="w-[630px] h-[793px] relative z-[4] mt-0 mr-0 mb-0 ml-[40px]">
        <button className="w-[242px] h-[70px] bg-[#d9d9d9] rounded-[54px] border-none relative z-[1] pointer mt-[216px] mr-0 mb-0 ml-[388px]">
          <span className="flex h-[39px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[16px] left-[70px] text-left whitespace-nowrap z-[6]">
            some text
          </span>
        </button>
        <div className="w-[281px] h-[243px] bg-[#d9d9d9] rounded-[60px] relative z-[4] mt-[61px] mr-0 mb-0 ml-0">
          <span className="flex w-[195px] h-[168px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[37px] left-[67px] text-left overflow-hidden z-[7]">
            some text
            <br />
            sometext
            <br />
            some text
            <br />
            sometext
          </span>
        </div>
        <button className="w-[604px] h-[105px] bg-[#d9d9d9] rounded-[66px] border-none relative pointer mt-[98px] mr-0 mb-0 ml-[12px]">
          <span className="flex h-[39px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[33px] left-[102px] text-left whitespace-nowrap z-[8]">
            sometext sometext sometext
          </span>
        </button>
        <div className="w-[230px] h-[189px] bg-[#d9d9d9] rounded-[54px] absolute top-0 left-[12px] z-[2]" />
        <span className="flex w-[208px] h-[76px] justify-start items-start font-['Irish_Grover'] text-[32px] font-normal leading-[38.688px] text-[#000] absolute top-[10px] left-[37px] text-left z-[3]">
          what would you like to ask about this aggriment
        </span>
      </div>
    </div>
  );
}

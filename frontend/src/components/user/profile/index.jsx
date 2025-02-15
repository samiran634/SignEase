import { RedirectToSignIn, useUser,UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import React,{useState} from "react";
 const ProfilePage=(props)=>{
    const user=useUser();
    if(!user){
        return (
            <RedirectToSignIn/>
        )
    }
    const navigate=useNavigate();
    return (
<div className="mt-16 w-screen h-screen flex justify-center items-center bg-white">
  <UserProfile 
    appearance={{
      elements: {
        rootBox: "w-full h-full flex justify-center items-center p-6 mt-10 relative", // Padding inside root container
        card: "w-full max-w-2xl h-full max-h-screen p-8 shadow-lg rounded-lg bg-white", // Card padding and background
        headerTitle: "text-2xl font-bold mb-4", // Bigger header with margin-bottom
        profileSectionTitle: "text-xl font-bold mt-4 mb-2", // Space above and below section titles
        profileSectionContent: "text-lg p-2", // Larger font and padding for readability
      },
    }} 
  />
       <button 
        onClick={() => navigate("/")} 
        className="absolute top-4 left-4 bg-zinc-600 text-white px-4 py-2 rounded-2lg shadow-md hover:bg-blue-700 transition"
      >
        ⬅ Back to Home
      </button>
</div>

    )
 }
 export default ProfilePage;
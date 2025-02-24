import { RedirectToSignIn, useUser,UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import React,{useState} from "react";
import { dark } from "@clerk/themes";

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
      baseTheme:dark,
      variables:{
        fontWeight:"bold",
      }
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
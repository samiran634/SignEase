// TakeConformation.jsx
import { useState, useEffect } from "react";
import { useUser, useOrganization } from "@clerk/clerk-react";

const TakeConformation = ({ onClose }) => {
  const { user } = useUser();
  const { organization } = useOrganization();

  async function handleClick() {
    if (!user || !organization) return;
    
    try {
      // Get memberships properly
      const memberships = await organization.getMemberships();
      console.log(memberships);
      
      // Filter for admin (fixed the data structure access)
      const admin = memberships.data.filter(member => member.role === "org:admin")[0];
      console.log(admin);
      
      if (admin) {
        const payload = {
          ccName: user.fullName,
          ccEmail: user.emailAddresses[0].emailAddress,
          signerName: admin.publicUserData.firstName, // Fixed property name
          signerEmail: admin.identifier, 
        };
      
        const response = await fetch('http://localhost:8080/send-envelope', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        console.log(data);
        
        if (data === "success") {
          setTimeout(() => {
            onClose(); // Use the onClose prop instead of local state
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-transparent p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/1160/1160923.png" alt="sign" className="w-20 h-20 mx-auto"/>
        </div>
        <div className="mt-4 text-center">
          <p className="text-center text-2xl mb-4">Are you sure? You can't redo this step</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleClick} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Yes
            </button>
            <button 
              onClick={onClose} 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeConformation;

 

 

 
  
  
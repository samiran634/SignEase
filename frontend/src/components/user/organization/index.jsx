import React, { useState } from "react";
import { OrganizationList, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const OrganizationSetup = () => {
  const [invitationCode, setInvitationCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // "list", "join", or "create"
  const { user } = useUser();
  const navigate = useNavigate();

  const handleJoinOrganization = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    setError(null);
    
    try {
      // Accept the invitation using Clerk's API
      await user.acceptOrganizationInvitation({
        organizationInvitationId: invitationCode
      });
      
      // Reset and show success message or redirect
      setInvitationCode("");
      setActiveTab("list");
    } catch (err) {
      setError("Invalid invitation code or you're already a member");
      console.error("Error joining organization:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const skipForNow = () => {
    // Navigate to the main dashboard/home page
    navigate("/home");
  };
  
  return (
    <div className="flex w-screen justify-center  bg-gradient-to-r from-red-600 to-blue-600 h-screen overflow-auto">
      <div className="flex flex-col justify-center bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6 mt-8 rounded-2lg"> 
        <h2 className="text-2xl text-center font-bold mb-6 text-black mt-4">Manage Your Organization</h2>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button 
            className={`py-2 px-4 ${activeTab === "list" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("list")}
          >
            My Organizations
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === "join" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("join")}
          >
            Join Organization
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === "create" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("create")}
          >
            Create New
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="mb-6">
          {activeTab === "list" && (
            <div>
              <p className="text-gray-600 mb-4">Organizations you're a member of:</p>
              <OrganizationList hideCreate />
            </div>
          )}
          
          {activeTab === "join" && (
            <form onSubmit={handleJoinOrganization}>
              <div className="mb-4">
                <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Invitation Code
                </label>
                <input
                  id="invitationCode"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter invitation code"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isJoining ? "Joining..." : "Join Organization"}
              </button>
            </form>
          )}
          
          {activeTab === "create" && (
            <div>
              <p className="text-gray-600 mb-4">Create a new organization:</p>
              <OrganizationList 
                hideFromList 
                afterCreateOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
              />
            </div>
          )}
        </div>
        
        {/* Skip for now button */}
        <button 
          onClick={skipForNow}
          className="text-gray-500 py-2 text-sm hover:text-gray-700"
        >
          proceed with selected organization
        </button>
        <button 
          onClick={skipForNow}
          className="text-gray-500 py-2 text-sm hover:text-gray-700"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default OrganizationSetup;

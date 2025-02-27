import { useState } from "react";
import { useUser, useOrganization } from "@clerk/clerk-react";

const JoinOrganization = () => {
  const [invitationCode, setInvitationCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  
  const handleJoinOrganization = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    setError(null);
    
    try {
      // Accept the invitation using Clerk's API
      await user.acceptOrganizationInvitation({
        organizationInvitationId: invitationCode
      });
      
      // Refresh the page or redirect to dashboard after successful join
      window.location.reload();
    } catch (err) {
      setError("Invalid invitation code or you're already a member");
      console.error("Error joining organization:", err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <h3 className="text-xl font-semibold mb-4">Join an Organization</h3>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isJoining}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-white"
        >
          {isJoining ? "Joining..." : "Join Organization"}
        </button>
      </form>
    </div>
  );
};

export default JoinOrganization;
import { useOrganizationList, useOrganization } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CustomOrganizationList = () => {
  const { setActive } = useOrganization();
  const { userMemberships, isLoaded } = useOrganizationList();
  console.log("userMemberships:", userMemberships);
  
console.log("userMemberships.data:", userMemberships?.data);
  const navigate = useNavigate();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  const handleOrganizationClick = async (organizationId) => {
    try {
      console.log("Switching to organization:", organizationId);
      
      // Set the active organization in Clerk
      await setActive({ organization: organizationId });
  
      console.log("Organization switched successfully!");
  
      // Navigate to home page (or any other page)
      navigate("/");
    } catch (error) {
      console.error("Error switching organization:", error);
    }
  };
  
  
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">Your Organizations</h2>
      
      {userMemberships.data.map((membership) => (
        <div 
          key={membership.organization.id}
          onClick={() => handleOrganizationClick(membership.organization.id)}
          className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <img 
            src={membership.organization.imageUrl || "/default-org.png"} 
            alt={membership.organization.name}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-lg">{membership.organization.name}</h3>
            <p className="text-sm text-gray-500">Role: {membership.role}</p>
          </div>
          {membership.organization.id === userMemberships.currentOrganization?.id && (
            <span className="text-green-500 text-xl">✓</span>
          )}
        </div>
      ))}
      
      {userMemberships.data.length === 0 && (
        <p className="text-gray-500">You don't belong to any organizations yet.</p>
      )}
    </div>
  );
};

export default CustomOrganizationList;
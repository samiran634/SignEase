import { useOrganization,OrganizationList } from "@clerk/clerk-react";
import JoinOrganization from "../joinOrganization";
  
 
 
const Dashboard = () => {
  const { organization, isLoaded } = useOrganization();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row items-center p-6">
      <div className="">
      <h2 className="text-2x text-black font-bold mb-6 trxt-center text-white" >
        {organization 
          ? `Current Organization: ${organization.name}`
          : "Organizations"}
      </h2>
      
      <div className="w-full max-w-md mb-8">
         
        <OrganizationList />

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8" onClick={() => window.history.back()}>
    Go Back
  </button>
      </div>
      </div>
    
     <div>
     {!organization && (
        <div className="w-full max-w-md mt-6">
          <JoinOrganization />
        </div>
      )}

     </div>
     
     
    </div>
 
  );
};

export default Dashboard;
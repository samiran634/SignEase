import React from "react";
import { OrganizationList, CreateOrganization } from "@clerk/clerk-react";

const OrganizationSetup = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Manage Your Organization</h2>
      <OrganizationList hidePersonal />
   
      <CreateOrganization />
    </div>
  );
};

export default OrganizationSetup;

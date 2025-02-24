import { useOrganization } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { organization } = useOrganization();
  const navigate = useNavigate();

  if (!organization) {
    navigate("/organizations"); // Force organization selection
    return null;
  }

  return <h1>Welcome to {organization.name} Dashboard</h1>;
};

export default Dashboard;

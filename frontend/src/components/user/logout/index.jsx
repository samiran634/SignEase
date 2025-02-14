import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut(); // Logs out the user
      navigate("/"); // Redirect to home
    };

    handleSignOut();
  }, [signOut, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Signing you out...</p>
    </div>
  );
}

import React from "react";

import { NavBar } from "../common/NavBar";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../common/card";
export default function PreviousPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const navItems = [
    {
      text: "home",
      onClick: () => navigate("/home"),
      ariaLabel: "home",
    },
    {
      text: "profile",
      onClick: () => navigate("/profile"),
      ariaLabel: "profile",
    },
    {
      text: "About",
      onClick: () => navigate("/about"),
      ariaLabel: "about",
    },
  ];

  return (
    <div>
      <div className="main-container w-screen h-screen bg-white relative overflow-hidden mx-auto my-0 px-6">
        <nav className="w-full sticky top-0 z-10 backdrop-blur">
          <NavBar siteName="signEase" navItems={navItems} />
        </nav>
    <CardComponent/>
       </div>
      </div>
     
  );
}

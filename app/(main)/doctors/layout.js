import { vailduser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Speciality - BookmyDoc",
  description: "Book appointments with doctors by speciality",
};

const layout = async({ children }) => {
  const user=await vailduser();
  if(!user){
    redirect("/");
  }
  return (
    <div className="mx-auto py-24 px-4 container">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
};

export default layout;

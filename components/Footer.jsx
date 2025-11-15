import React from "react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4 text-center text-gray-200">
        <p>&copy; {new Date().getFullYear()} BookMyDoc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

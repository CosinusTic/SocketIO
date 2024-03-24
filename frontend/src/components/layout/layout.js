import React from "react";
import "./Layout.css";

// Importing all created components
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

// Pass the child props
export default function Layout({ children }) {
  return (
    <div>
      {/* Attaching all file components */}
      <Navbar />
      <Sidebar />
      {children}
      <Footer /> {/* Attach if necessary */}
    </div>
  );
}
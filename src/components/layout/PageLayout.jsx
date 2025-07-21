import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header.jsx";
import "./PageLayout.css";

export const PageLayout = () => {
  return (
    <div className="page-layout">
      <Header className="page-header" />
      <main className="page-content">
        {/* Content will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

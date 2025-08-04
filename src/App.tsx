import React from "react";
import { useRoutes } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import "./assets/styles/global.css.css";

const App = () => {
  const routing = useRoutes(AppRoutes);

  return (
    <>
      <Navbar />  {/* Show Navbar above all routes */}
      {routing}
    </>
  );
};

export default App;

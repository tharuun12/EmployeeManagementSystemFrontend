import React from "react";
import { useRoutes } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import "./assets/styles/global.css.css";
import "./assets/styles/toast.css";
import { ToastContainer } from "react-toastify";


const App = () => {
  const routing = useRoutes(AppRoutes);

  return (
    <>
      <Navbar />  
      {routing}
      <ToastContainer />

    </>
  );
};

export default App;

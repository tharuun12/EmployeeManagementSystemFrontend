import React from "react";
import "../../assets/styles/LoadingSpinner.css";  

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;

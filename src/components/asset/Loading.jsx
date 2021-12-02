import React from "react";
import Loader from "react-loader-spinner";
import "./asset.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <Loader type="Rings" color="#CECECE" height={550} width={80} />
    </div>
  );
};

export default Loading;

import React from "react";
import Navbar from "../components/Home/Navbar";
import PageHeader from "../components/Privacy/PageHeader";
import PrivacyPoints from "../components/Privacy/PrivacyPoints";
import Footer from "../components/Home/Footer";

const PrivacyView = () => {
  return (
    <>
      <Navbar />
      <PageHeader />
      <PrivacyPoints />
    </>
  );
};

export default PrivacyView;

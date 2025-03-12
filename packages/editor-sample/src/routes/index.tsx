import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignIn from "../App/auth/auth.component";
import Home from "../App/home";

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send-email" element={<SignIn />} />
        <Route path="/auth" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;

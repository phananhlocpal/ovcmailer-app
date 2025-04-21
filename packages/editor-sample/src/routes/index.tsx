import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignIn from "../App/auth/auth.component";
import EmailMarketing from "../App/email-marketing";
import EmailNormal from "../App/email-normal";

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmailMarketing />} />
        <Route path="/send-email" element={<SignIn />} />
        <Route path="/auth" element={<SignIn />} />
        <Route path="/email" element={<EmailNormal />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;

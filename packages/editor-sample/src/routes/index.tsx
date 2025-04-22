import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignIn from "../App/auth/auth.component";
import EmailMarketing from "../App/email-marketing";
import EmailNormal from "../App/email-normal";
import UserList from "../App/admin/users/index";
import Navigator from "../shared/layouts/navigator";

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigator />}>
          <Route index element={<EmailMarketing />} />
          <Route path="/send-email" element={<SignIn />} />
          <Route path="/auth" element={<SignIn />} />
          <Route path="/email" element={<EmailNormal />} />
          <Route path="/user" element={<UserList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterComponent;

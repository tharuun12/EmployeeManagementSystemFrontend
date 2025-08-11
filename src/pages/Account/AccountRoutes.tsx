import React from "react";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";
import VerifyOtp from "./VerifyOtp";
import api from "../../api/axiosInstance"; 


const AccountRoutes = [
  {
    path: "/account/changepassword",
    element: <ChangePassword />,
  },
  {
    path: "/account/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/account/login",
    element: <Login />,
  },
  {
    path: "/account/register",
    element: <Register />,
  },
  {
    path: "/account/resetpassword",
    element: <ResetPassword />,
  },
  {
    path: "/account/verifyotp",
    element: <VerifyOtp />,
  },
];

export default AccountRoutes;
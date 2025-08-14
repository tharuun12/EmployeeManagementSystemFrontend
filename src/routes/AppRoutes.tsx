import React from "react";
import { RouteObject } from "react-router-dom";
import AccountRoutes from "../pages/Account/AccountRoutes";
import ActivityRoutes from "../pages/Activity/ActivityRoutes";
import DashboardRoutes from "../pages/Dashboard/DashboardRoutes";
import DepartmentRoutes from "../pages/Department/DepartmentRoutes";
import EmployeeRoutes from "../pages/Employee/EmployeeRoutes";
import LeaveRoutes from "../pages/Leave/LeaveRoutes";
import ManagerRoutes from "../pages/Manager/ManagerRoutes";
import { Navigate } from "react-router-dom";


const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/account/login" replace /> 
  },
  ...AccountRoutes,
  ...ActivityRoutes,
  ...DashboardRoutes,
  ...DepartmentRoutes,
  ...EmployeeRoutes,
  ...LeaveRoutes,
  ...ManagerRoutes
];

export default routes;
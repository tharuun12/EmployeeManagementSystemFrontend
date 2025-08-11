import React from "react";
import { RouteObject } from "react-router-dom";
import AccountRoutes from "../pages/Account/AccountRoutes";
import ActivityRoutes from "../pages/Activity/ActivityRoutes";
import DashboardRoutes from "../pages/Dashboard/DashboardRoutes";
import DepartmentRoutes from "../pages/Department/DepartmentRoutes";
import EmployeeRoutes from "../pages/Employee/EmployeeRoutes";
import LeaveRoutes from "../pages/Leave/LeaveRoutes";
import ManagerRoutes from "../pages/Manager/ManagerRoutes";

const routes: RouteObject[] = [
  ...AccountRoutes,
  ...ActivityRoutes,
  ...DashboardRoutes,
  ...DepartmentRoutes,
  ...EmployeeRoutes,
  ...LeaveRoutes,
  ...ManagerRoutes
];

export default routes;
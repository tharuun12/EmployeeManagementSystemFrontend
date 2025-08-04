import React from "react";
import Create from "./Create";
import CurrentMonthInfo from "./CurrentMonthInfo";
import Delete from "./Delete";
import Edit from "./Edit";
import EmployeeList from "./EmployeeList";
import Filter from "./Filter";
import Index from "./Index";
import ManagersList from "./ManagersList";
import MyLeaves from "./MyLeaves";

const EmployeeRoutes = [
  {
    path: "/employee/create",
    element: <Create />,
  },
  {
    path: "/employee/currentmonthinfo",
    element: <CurrentMonthInfo />,
  },
  {
    path: "/employee/delete/:id",
    element: <Delete />,
  },
  {
    path: "/employee/edit/:id",
    element: <Edit />,
  },
  {
    path: "/employee/employeelist",
    element: <EmployeeList />,
  },
  {
    path: "/employee/filter",
    element: <Filter />,
  },
  {
    path: "/employee/profile/:id",
    element: <Index />,
  },
  {
    path: "/employee/managerslist",
    element: <ManagersList />,
  },
  {
    path: "/employee/myleaves/:id",
    element: <MyLeaves />,
  },
];

export default EmployeeRoutes;
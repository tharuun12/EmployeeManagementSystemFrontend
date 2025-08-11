import React from "react";
import Apply from "./Apply";
import Approvals from "./Approvals";
import ApproveList from "./ApproveList";
import EmployeeLeaveList from "./ManagerApprovalList";
import MyLeaves from "./MyLeaves";

const LeaveRoutes = [
  {
    path: "/leave/apply",
    element: <Apply />,
  },
  {
    path: "/leave/approval/:id",
    element: <Approvals />,
  },
  {
    path: "/leave/approvelist",
    element: <ApproveList />,
  },
  {
    path: "/leave/employeeleavelist",
    element: <EmployeeLeaveList />,
  },
  {
    path: "/leave/myleaves",
    element: <MyLeaves />,
  },
];

export default LeaveRoutes;
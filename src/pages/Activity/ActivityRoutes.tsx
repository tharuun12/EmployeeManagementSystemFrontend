import React from "react";
import Index from "./Index";
import LoginHistory from "./LoginHistory";
import RecentActivity from "./RecentActivity";

const ActivityRoutes = [
  {
    path: "/activity/",
    element: <Index />,
  },
  {
    path: "/activity/loginhistory",
    element: <LoginHistory />,
  },
  {
    path: "/activity/recentactivity",
    element: <RecentActivity />,
  },
];

export default ActivityRoutes;
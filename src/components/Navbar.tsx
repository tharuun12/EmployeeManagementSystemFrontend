// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../assets/styles/global.css.css"
const Navbar = () => {
  const { user, role, isLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">EMS</Link>

      <ul className="navbar-links">
        {isLoggedIn && role === "Admin" && (
          <>
            <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
            <li><Link to="/employee/employeelist" className="navbar-link">All Employees</Link></li>
            <li><Link to="/employee/managerslist" className="navbar-link">Managers</Link></li>
            <li><Link to="/department" className="navbar-link">Departments</Link></li>
            <li><Link to="/leave/approvelist" className="navbar-link">Leave Approvals</Link></li>
            <li><Link to="/activity" className="navbar-link">Logs</Link></li>
            <li><Link to="/account/changepassword" className="navbar-link">Change Password</Link></li>
          </>
        )}

        {isLoggedIn && role === "Manager" && (
          <>
            <li><Link to="/manager" className="navbar-link">My Profile</Link></li>
            <li><Link to="/manager/subordinates" className="navbar-link">Team</Link></li>
            <li><Link to="/leave/employeeleavelist" className="navbar-link">Leave Approvals</Link></li>
            <li><Link to="/leave/apply" className="navbar-link">Apply Leave</Link></li>
            <li><Link to="/leave/myleaves" className="navbar-link">My Leaves</Link></li>
            <li><Link to="/account/changepassword" className="navbar-link">Change Password</Link></li>
          </>
        )}

        {isLoggedIn && role === "Employee" && (
          <>
            <li><Link to="/employee/profile" className="navbar-link">Profile</Link></li>
            <li><Link to="/leave/apply" className="navbar-link">Apply Leave</Link></li>
            <li><Link to="/leave/myleaves" className="navbar-link">Leave History</Link></li>
            <li><Link to="/employee/monthlyreport" className="navbar-link">Monthly Report</Link></li>
            <li><Link to="/account/changepassword" className="navbar-link">Change Password</Link></li>
          </>
        )}

        {!isLoggedIn && (
          <>
            <li><Link to="/account/login" className="navbar-link">Login</Link></li>
            <li><Link to="/account/register" className="navbar-link">Register</Link></li>
          </>
        )}

        {isLoggedIn && (
          <li>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/account/login";
              }}
              className="navbar-logout"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

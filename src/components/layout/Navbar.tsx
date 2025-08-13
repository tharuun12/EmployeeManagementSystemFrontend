// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../assets/styles/global.css.css";
import api from "../../api/axiosInstance"; 
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";

const Navbar = () => {
  const { user, role, isLoggedIn } = useAuth();
  const [loading, setLoading] = React.useState(false);

  return (
    <nav className="navbar">
      <p className="navbar-brand">EMS</p>


      <div className="navbar-main">
        <div className="navbar-links">
          {isLoggedIn && role === "Admin" && (
            <>
              <li><Link to="/dashboard" className="navbar-link">Home</Link></li>
              <li><Link to="/employee/employeelist" className="navbar-link">Employees</Link></li>
              <li><Link to="/department" className="navbar-link">Departments</Link></li>
              <li><Link to="/leave/approvelist" className="navbar-link">Leave Approvals</Link></li>
              <li><Link to="/employee/filter" className="navbar-link">Filter</Link></li>
              <li><Link to="/employee/managerslist" className="navbar-link">Managers</Link></li>
              <li><Link to="/activity" className="navbar-link">Logs</Link></li>
              <li><Link to="/account/changepassword" className="navbar-link">Change Password</Link></li>
            </>
          )}

          {isLoggedIn && role === "Manager" && (
            <>
              <li><Link to="/manager/profile" className="navbar-link">Profile</Link></li>
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
        </div>


      </div>
      <div className="navbar-links1">
        {!isLoggedIn && (
          <>
            <li><Link to="/account/login" className="navbar-link">Login</Link></li>
            <li><Link to="/account/register" className="navbar-link">Register</Link></li>
          </>
        )}

        {isLoggedIn && (
          <li>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await api.post("/account/logout");

                  localStorage.clear();
                  sessionStorage.clear();

                  window.location.href = "/account/login";
                } catch (err: any) {
                  const errorMessage =
                    err?.response?.data?.message || "Failed to change password.";
                  toast.error(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
              className="navbar-logout"
            >
              Logout
            </button>
          </li>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
type Department = {
  departmentName: string;
};

type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department?: Department;
  leaveBalance: number;
  isActive: boolean;
};

type EmployeeProfile = {
  employee: Employee;
  managerName: string;
};

const EmployeeProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/employees/profile", {
      params: {
        id: localStorage.getItem("userId"),
      }
      })
      .then((res) => {
      console.log(res.data);
      setProfile(res.data);
      setLoading(false);
      })
      .catch(() => {
      setError("Failed to load profile.");
      setLoading(false);
      });
  }, []);

  return (
    <div className="employee-profile-container">
      <div className="employee-profile-card">
        <h2 className="profile-title">Employee Profile</h2>
        {loading ? (
          <div className="profile-row">Loading...</div>
        ) : error ? (
          <div className="profile-row">{error}</div>
        ) : profile ? (
          <div className="profile-info">
            <div className="profile-row">
              <span className="label">Full Name:</span>
              <span className="value">{profile.employee?.fullName}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{profile.employee?.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Phone:</span>
              <span className="value">{profile.employee?.phoneNumber}</span>
            </div>
            <div className="profile-row">
              <span className="label">Role:</span>
              <span className="value">{profile.employee?.role}</span>
            </div>
            <div className="profile-row">
              <span className="label">Department:</span>
              <span className="value">{profile.employee?.department?.departmentName || ""}</span>
            </div>
            <div className="profile-row">
              <span className="label">Manager:</span>
              <span className="value">{profile?.managerName}</span>
            </div>
            <div className="profile-row">
              <span className="label">Leave Balance:</span>
              <span className="value">{profile.employee?.leaveBalance}</span>
            </div>
            <div className="profile-row">
              <span className="label">Status:</span>
              <span className="value">
                {profile.employee?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeProfile;
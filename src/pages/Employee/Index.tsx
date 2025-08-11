import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";

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
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/employees/profile", {
      params: {
        id: localStorage.getItem("userId"),
      }
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load profile.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="employee-profile-container">
      <div className="employee-profile-card">
        <h2 className="profile-title">Employee Profile</h2>
        { error ? (
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
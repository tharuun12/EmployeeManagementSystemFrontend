import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 

type Department = {
    departmentId: number;
    departmentName: string;
};

type Employee = {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department?: Department;
  leaveBalance: number;
  isActive: boolean;
};

const ManagerProfile = () => {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/manager/profile")
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
        <h2 className="profile-title">Manager Profile</h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="profile-row">{error}</div>
        ) : profile ? (
          <div className="profile-info">
            <div className="profile-row">
              <span className="label">Full Name:</span>
              <span className="value">{profile.fullName}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Phone:</span>
              <span className="value">{profile.phoneNumber}</span>
            </div>
            <div className="profile-row">
              <span className="label">Role:</span>
              <span className="value">{profile.role}</span>
            </div>
            <div className="profile-row">
              <span className="label">Department:</span>
              <span className="value">{profile.department?.departmentName || ""}</span>
            </div>
            <div className="profile-row">
              <span className="label">Leave Balance:</span>
              <span className="value">{profile.leaveBalance}</span>
            </div>
            <div className="profile-row">
              <span className="label">Status:</span>
              <span className={`value ${profile.isActive ? "approved" : "rejected"}`}>
                {profile.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ManagerProfile;
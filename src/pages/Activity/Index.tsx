import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance";
import { Link } from "react-router-dom";

type Employee = {
  fullName: string;
  email: string;
};

const ActivityIndex = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    setLoading(true);
    api
      .get(`/activity/employees`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load.";
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
    <div className="data-section">
      <h2 className="data-title">Employee Activity Tracker</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : employees.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx}>
                <td>{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>
                  <Link
                    to={`/activity/loginhistory`}
                    className="btn-create btn-action"
                  >
                    Login History
                  </Link>
                  {/* 
                  <Link
                    to={`/activity/recentactivity/${encodeURIComponent(emp.email)}`}
                    className="btn btn-sm btn-secondary"
                  >
                    Recent Activity
                  </Link>
                  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">
          No employee activity records available.
        </div>
      )}
    </div>
  );
};

export default ActivityIndex;
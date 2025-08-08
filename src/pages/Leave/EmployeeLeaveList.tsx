import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; import { Link } from "react-router-dom";

type Employee = {
  fullName: string;
};

type LeaveRequest = {
  leaveRequestId: number;
  employee?: Employee;
  startDate: string;
  endDate: string;
  reason: string;
};

const EmployeeLeaveList = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/leave/employeeleavelist")
      .then((res) => {
        setLeaves(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load pending leave requests.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">Pending Leave Approvals</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="data-empty alert alert-warning text-center mt-3">{error}</div>
      ) : leaves.length > 0 ? (
        <table className="table table-bordered table-striped data-table">
          <thead className="table-header">
            <tr>
              <th>Employee</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.leaveRequestId}>
                <td>{leave.employee?.fullName || ""}</td>
                <td>
                  {leave.startDate
                    ? new Date(leave.startDate).toLocaleDateString()
                    : ""}
                </td>
                <td>
                  {leave.endDate
                    ? new Date(leave.endDate).toLocaleDateString()
                    : ""}
                </td>
                <td>{leave.reason}</td>
                <td>
                  <Link
                    to={`/leave/approvals/${leave.leaveRequestId}`}
                    className=".btn-action .btn-create"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">
          No pending leave requests to approve.
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveList;
import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
import { useParams } from "react-router-dom";
type LeaveRequest = {
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

const MyLeaves = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    api
      .get("/employees/my-leaves", {
        params: {
          employeeId: localStorage.getItem("employeeId"),
        },
      })
      .then((res) => {
        setLeaves(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load leave requests.");
        setLoading(false);
      }).finally(() => {
        setLoading(true);
      });
  }, [id]);

    if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-section">
      <h2 className="data-title">My Leaves - This Month</h2>
      {leaves.length > 0 ? (
        <table className="data-table">
          <thead >
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, idx) => (
              <tr key={idx}>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>
                  {leave.status === "Approved" ? (
                    <span className="status-approved">Approved</span>
                  ) : leave.status === "Rejected" ? (
                    <span className="status-rejected">Rejected</span>
                  ) : (
                    <span className="status-pending">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty ">
          You have not applied for any leaves this month.
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
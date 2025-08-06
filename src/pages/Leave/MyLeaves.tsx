import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
type LeaveRequest = {
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  requestDate: string;
};

const MyLeaves = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/leave/my/${localStorage.getItem("userId")}`)
      .then((res) => {
        setLeaves(res.data.leaves || res.data); 
        setEmployeeName(res.data.employeeName || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your leaves.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="data-section">
      <h2 className="data-title">
        My Leaves{employeeName ? ` - ${employeeName}` : ""}
      </h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : leaves.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, idx) => (
              <tr key={idx}>
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
                  <span className={`data-status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  {leave.requestDate
                    ? new Date(leave.requestDate).toLocaleDateString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">
          You don't have any approved or past leaves.
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
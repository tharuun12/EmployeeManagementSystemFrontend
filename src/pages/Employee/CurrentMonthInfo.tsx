import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
import { Console } from "console";
type LeaveRequest = {
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  requestDate: string;
};

type CurrentMonthInfo = {
  currentMonth: string;
  leaveRequests: LeaveRequest[];
  daysOnLeave?: number;
  employee?: any; 
  managerName?: string;
  remainingLeaveBalance?: number;
};

const CurrentMonthInfo = () => {
  const [data, setData] = useState<CurrentMonthInfo | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
  api
    .get("/employees/current-month-info", {
      params: {
        id: localStorage.getItem("userId"),
      }
    })
    .then((res) => {
      const response = res.data;
      if (response && Array.isArray(response.leaveRequests)) {
        setData(response);
        setLeaves(response.leaveRequests);
      } else {
        setData(response);
        setLeaves([]);
      }
    })
    .catch(() => {
      setError("Failed to load current month information.");
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
      <h2 className="data-title">
        Current Month Information
        {data && data.currentMonth ? ` - ${data.currentMonth}` : ""}
      </h2>

      {data && Array.isArray(data.leaveRequests) && data.leaveRequests.length > 0 ? (
          <div className="">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Request Date</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, idx) => (
                  <tr key={idx}>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                     <td>
                      <span className={`data-status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{new Date(leave.requestDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="data-empty">No leave requests for the current month.</div>
        )}
    </div>
  );
};

export default CurrentMonthInfo;
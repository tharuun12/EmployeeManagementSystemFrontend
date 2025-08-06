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


const getBadgeClass = (status: string) => {
  if (status === "Approved") return "bg-success";
  if (status === "Rejected") return "bg-danger";
  return "bg-warning";
};

const CurrentMonthInfo = () => {
  const [data, setData] = useState<CurrentMonthInfo | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/employees/current-month-info", {
        params: {
          id: localStorage.getItem("userId"),
        }
      })
      .then((res) => {
        const response = res.data;
        console.log("Current Month Info Response:", response);
        if (response && Array.isArray(response.leaveRequests)) {
          setData(response);
          setLeaves(response.leaveRequests);
        } else {
          setData(response);
          setLeaves([]); // fallback
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load current month information.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">
        Current Month Information
        {data && data.currentMonth ? ` - ${data.currentMonth}` : ""}
      </h2>

      {loading ? (
        <div className="alert alert-info"><LoadingSpinner /></div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : data && Array.isArray(data.leaveRequests) && data.leaveRequests.length > 0 ? (
          <div className="">
            <div className="text-black">
              <h4>Leave Requests for {data.currentMonth}</h4>
              <p>
                Days on Leave: {data?.daysOnLeave ?? 0} <br />
                Remaining Leave Balance: {data?.remainingLeaveBalance ?? 0}
              </p>

            </div>
            <div className="card-body">
              <table className="table table-striped">
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
                        <span className={`badge ${getBadgeClass(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>{new Date(leave.requestDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No leave requests for the current month.</div>
        )}
    </div>
  );
};

export default CurrentMonthInfo;
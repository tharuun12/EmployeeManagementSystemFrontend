import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; import { useParams } from "react-router-dom";

type LoginActivityLog = {
  email: string;
  loginTime: string;
  logoutTime?: string | null;
  ipAddress: string;
  isSuccessful: boolean;
  sessionDuration?: string | null; 
};

const formatDateTime = (dt: string | null | undefined) => {
  if (!dt) return "N/A";
  const date = new Date(dt);
  return isNaN(date.getTime()) ? dt : date.toLocaleString();
};

const formatSessionDuration = (duration: string | null | undefined, logoutTime: string | null | undefined) => {
  if (!duration) return logoutTime ? "N/A" : "Still Logged In";
  if (/^\d{2}:\d{2}:\d{2}$/.test(duration)) return duration;
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const h = match[1] ? match[1].padStart(2, "0") : "00";
      const m = match[2] ? match[2].padStart(2, "0") : "00";
      const s = match[3] ? match[3].padStart(2, "0") : "00";
      return `${h}:${m}:${s}`;
    }
  } catch {}
  return duration;
};

const LoginHistory = () => {
  const [logs, setLogs] = useState<LoginActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let url = `/Activity/login-history/${userId}`;
    setLoading(true);
    api
      .get(url)
      .then((res) => {
        setLogs(res.data.logs);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load login history .";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-section">
      <h2 className="data-title">Login History</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : logs.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              {/* <th>IP Address</th>
              <th>Successful</th> */}
              <th>Session Duration</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.email}</td>
                <td>{formatDateTime(log.loginTime)}</td>
                <td>{formatDateTime(log.logoutTime)}</td>
                {/* <td>{log.ipAddress}</td>
                <td>{log.isSuccessful ? "No" : "Yes"}</td> */}
                <td>
                  {formatSessionDuration(log.sessionDuration, log.logoutTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">No login records found.</div>
      )}
    </div>
  );
};

export default LoginHistory;
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; import { useParams } from "react-router-dom";

type UserActivityLog = {
  accessedAt: string;
  urlAccessed: string;
  controllerName: string;
  actionName: string;
  ipAddress: string;
  userAgent: string;
};

const formatDateTime = (dt: string | null | undefined) => {
  if (!dt) return "";
  const date = new Date(dt);
  return isNaN(date.getTime()) ? dt : date.toLocaleString();
};

const RecentActivity = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let url = "/activity/recentactivity";
    if (userId) {
      url += `/${encodeURIComponent(userId)}`;
    }
    api
      .get(url)
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load recent activity records.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="data-section">
      <h2 className="data-title">Recent Activity</h2>
      {loading ? (
        <div className="data-empty">Loading...</div>
      ) : error ? (
        <div className="data-empty">{error}</div>
      ) : activities.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Accessed At</th>
              <th>URL</th>
              <th>Controller</th>
              <th>Action</th>
              <th>IP Address</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <tr key={idx}>
                <td>{formatDateTime(activity.accessedAt)}</td>
                <td>{activity.urlAccessed}</td>
                <td>{activity.controllerName}</td>
                <td>{activity.actionName}</td>
                <td>{activity.ipAddress}</td>
                <td>{activity.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="data-empty">No recent activity records found.</div>
      )}
    </div>
  );
};

export default RecentActivity;
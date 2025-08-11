import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; import { useNavigate, useParams, Link } from "react-router-dom";

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

const LeaveApprovals = () => {
  const { id } = useParams<{ id: string }>();
  const [leave, setLeave] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(false);  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      setError("Invalid leave request ID.");
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(`/leave/${id}`)
      .then((res) => {
        setLeave(res.data);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAction = async (status: "Approved" | "Rejected") => {
    if (!leave) return;
    setSubmitting(true);
    setError("");
    setLoading(true);
    try {
      await api.post(`/leave/approved/${leave.leaveRequestId}`, {
        id: leave.leaveRequestId,
        status: status.toLowerCase(),
      });
      navigate("/leave/approvelist");
    }  catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ;
        console.log("Error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="create-form">
      <h2 className="form-title">Review Leave Request</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input type="hidden" name="leaveRequestId" value={leave?.leaveRequestId ?? ""} />

        <div className="form-group">
          <label className="form-label">Employee</label>
          <div className="form-control-plaintext">{leave?.employee?.fullName || ""}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Start Date</label>
          <div className="form-control-plaintext">
            {leave?.startDate ? new Date(leave.startDate).toLocaleDateString() : ""}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <div className="form-control-plaintext">
            {leave?.endDate ? new Date(leave.endDate).toLocaleDateString() : ""}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason</label>
          <div className="form-control-plaintext">{leave?.reason}</div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-approve btn-action"
            disabled={submitting}
            onClick={() => handleAction("Approved")}
          >
            Approve
          </button>
          <button
            type="button"
            className="btn-delete btn-action"
            disabled={submitting}
            onClick={() => handleAction("Rejected")}
            style={{ marginLeft: 8 }}
          >
            Reject
          </button>
          <Link to="/leave/approvelist" className="btn-cancel btn-action" style={{ marginLeft: 8 }}>
            Cancel
          </Link>
        </div>
        {error && (
          <div className="alert alert-danger" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default LeaveApprovals;
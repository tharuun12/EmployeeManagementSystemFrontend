import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance"; 
import { useNavigate, useParams, Link } from "react-router-dom";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";

type Department = {
  departmentId: number;
  departmentName: string;
};

const DepartmentDelete = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      toast.error("Invalid department ID.");
      return;
    }
    setLoading(true);
    api
      .get(`/department/delete/${id}`)
      .then((res) => {
        setDepartment(res.data);
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

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!department) return;
    setDeleting(true);
    try {
      await api.delete(`/department/delete/${department.departmentId}`);
      notifySuccess("Department deleted successfully.");
      navigate("/department");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete department.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h2>Delete Department</h2>
      <p>
        Are you sure you want to delete <strong>{department?.departmentName}</strong>?
      </p>
      <form onSubmit={handleDelete}>
        <input type="hidden" name="departmentId" value={department?.departmentId ?? ""} />
        <button type="submit" className=".btn-delete btn-action" disabled={deleting}>
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <Link to="/department" className="btn-cancel btn-action" style={{ marginLeft: 8 }}>
          Cancel
        </Link>
      </form>
    </>
  );
};

export default DepartmentDelete;
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
type Manager = {
  employeeId: number;
  fullName: string;
};

type DepartmentForm = {
  departmentId: number;
  departmentName: string;
  managerId: string;
};

type DepartmentErrors = {
  departmentName?: string;
  managerId?: string;
};

const DepartmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<DepartmentForm>({
    departmentId: 0,
    departmentName: "",
    managerId: "",
  });
  const [errors, setErrors] = useState<DepartmentErrors>({});
  const [serverError, setServerError] = useState("");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptRes, mgrRes] = await Promise.all([
          api.get("/employees"),
          api.get(`/department/edit/${id}`),
        ]);

        setForm({
          departmentId: mgrRes.data.departmentId,
          departmentName: mgrRes.data.departmentName,
          managerId: mgrRes.data.managerId?.toString() ?? "",
        });

        setManagers(Array.isArray(deptRes.data) ? deptRes.data : []);
        
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to load.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.departmentName) {
      toast.error("Department Name is required");
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        DepartmentName: form.departmentName,
        departmentId: form.departmentId,
      };

      if (form.managerId) {
        payload.ManagerId = Number(form.managerId);
      }
      await api.put(`/department/edit/${form.departmentId}`, {
        ...payload,
      });
      notifySuccess("Department Updated successfully!");
      navigate("/department");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message;
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="create-form">
      <h2 className="form-title">Edit Department</h2>
      <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="form-error" style={{ marginBottom: 8 }}>
            {serverError}
          </div>
        )}
        <input type="hidden" name="departmentId" value={form.departmentId} />

        <div className="form-group">
          <label className="form-label" htmlFor="departmentName">
            Department Name
          </label>
          <input
            name="departmentName"
            id="departmentName"
            className="form-control"
            value={form.departmentName}
            onChange={handleChange}
            required
          />
          {errors.departmentName && (
            <span className="form-error">{errors.departmentName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="managerId">
            Manager
          </label>
          <select
            name="managerId"
            id="managerId"
            className="form-control"
            value={form.managerId}
            onChange={handleChange}

          >
            <option value="">-- No Manager Assigned --</option>
            {managers.map((manager) => (
              <option key={manager.employeeId} value={manager.employeeId}>
                {manager.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-approve btn-action">
            Update
          </button>
          <Link to="/department" className="btn-cancel btn-action">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DepartmentEdit;
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch department and managers
    const fetchData = async () => {
      try {
        const [deptRes, mgrRes] = await Promise.all([
          api.get("/employees"),
          api.get(`/department/edit/${id}`),

        ]);
        console.log(deptRes.data, mgrRes.data);
        setForm({
          departmentId: mgrRes.data.departmentId,
          departmentName: mgrRes.data.departmentName,
          managerId: mgrRes.data.managerId?.toString() ?? "",
        });
        setManagers(Array.isArray(deptRes.data) ? deptRes.data : []);
        setLoading(false);
      } catch {
        setServerError("Failed to load department data.");
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
    setServerError("");
    // Basic validation
    if (!form.departmentName) {
      setErrors((prev) => ({
        ...prev,
        departmentName: "Department Name is required",
      }));
      return;
    }
    if (!form.managerId) {
      setErrors((prev) => ({
        ...prev,
        managerId: "Manager is required",
      }));
      return;
    }
    try {
      await api.put(`/department/edit/${form.departmentId}`, {
        departmentId: form.departmentId,
        departmentName: form.departmentName,
        managerId: Number(form.managerId),
      });
      navigate("/department");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response === "object" &&
        (err as any).response !== null &&
        "data" in (err as any).response &&
        typeof (err as any).response.data === "object" &&
        (err as any).response.data !== null
      ) {
        setServerError(
          ((err as any).response.data.message as string) ||
            "Failed to update department"
        );
      } else {
        setServerError("Failed to update department");
      }
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading...</div>;
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
            required
          >
            <option value="">-- Select Manager --</option>
            {managers?.map((manager) => (
              <option key={manager.employeeId} value={manager.employeeId}>
                {manager.fullName}
              </option>
            ))}
          </select>
          {errors.managerId && (
            <span className="form-error">{errors.managerId}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            Update
          </button>
          <Link to="/department" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DepartmentEdit;
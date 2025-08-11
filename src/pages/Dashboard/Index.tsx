import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { notifySuccess, notifyError } from "../../components/shared/toastService";
import LoadingSpinner  from "../../components/shared/LoadingSpinner";
import api from "../../api/axiosInstance"; 
import Chart from "chart.js/auto";
import { useRef } from "react";

type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

type DepartmentStats = {
  name: string;
  employeeCount: number;
};

type DashboardData = {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  recentEmployees: Employee[];
  departmentStats: DepartmentStats[];
  approvedLeaves: number;
  pendingLeaves: number;
  rejectedLeaves: number;
  totalLeaveRequests: number;
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/dashboard/Index")
      .then((res) => {
        setData(res.data);
      })
      .catch((err: any) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  useEffect(() => {
    if (!data) return;

    let summaryChart: Chart | null = null;
    let activeChart: Chart | null = null;

    // Summary Chart (Doughnut)
    const summaryCtx = document.getElementById("summaryChart") as HTMLCanvasElement | null;
    if (summaryCtx) {
      summaryChart = new Chart(summaryCtx, {
        type: "doughnut",
        data: {
          labels: ["Approved", "Pending", "Rejected"],
          datasets: [
            {
              label: "Leave Requests",
              data: [data.approvedLeaves, data.pendingLeaves, data.rejectedLeaves],
              backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
              borderWidth: 3,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "50%",
          plugins: {
            title: {
              display: true,
              text: "Leave Request Status",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              position: "bottom",
              labels: { padding: 15 },
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const total = data.totalLeaveRequests;
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Active Employees Chart (Pie)
    const activeCtx = document.getElementById("activeEmployeesChart") as HTMLCanvasElement | null;
    if (activeCtx) {
      activeChart = new Chart(activeCtx, {
        type: "pie",
        data: {
          labels: data.departmentStats.map((d) => d.name),
          datasets: [
            {
              label: "Active Employees",
              data: data.departmentStats.map((d) => d.employeeCount),
              backgroundColor: [
                "#4e79a7",
                "#f28e2c",
                "#e15759",
                "#76b7b2",
                "#59a14f",
                "#edc948",
                "#b07aa1",
                "#9c755f",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: "Active Employee Department Wise",
              font: { size: 16, weight: "bold" },
            },
          },
        },
      });
    }

    // Cleanup function to destroy charts
    return () => {
      if (summaryChart) {
        summaryChart.destroy();
      }
      if (activeChart) {
        activeChart.destroy();
      }
    };
  }, [data]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error || !data) {
    return <div className="data-empty">{error || "No data available."}</div>;
  }

  return (
    <>
      <h2 className="text-center mb-4">EMS Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card total">
          <h3>Total Employees</h3>
          <p>{data.totalEmployees}</p>
        </div>
        <div className="card active">
          <h3>Active Employees</h3>
          <p>{data.activeEmployees}</p>
        </div>
        <div className="card departments">
          <h3>Total Departments</h3>
          <p>{data.totalDepartments}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 30, justifyContent: "center", flexWrap: "wrap" }}>
        <div>
          <canvas id="activeEmployeesChart" width={400} height={400} className="chart-canvas"></canvas>
        </div>
        <div>
          <canvas id="summaryChart" width={400} height={400} className="chart-canvas"></canvas>
        </div>
      </div>

      <h4 className="mt-5">🧑‍💼 Recent Employees</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {data.recentEmployees.map((emp, idx) => (
            <tr key={idx}>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.phoneNumber}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-5">🏢 Department-wise Employee Count</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>No. of Employees</th>
          </tr>
        </thead>
        <tbody>
          {data.departmentStats.map((stat, idx) => (
            <tr key={idx}>
              <td>{stat.name}</td>
              <td>{stat.employeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Dashboard;
import Sidebar from "../components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />   {/* nested pages render HERE */}
      </div>
    </div>
  );
}

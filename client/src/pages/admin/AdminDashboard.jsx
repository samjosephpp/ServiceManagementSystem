import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import DashStatCard from "../shared/DashStatCard";
import { getAdminDashboardData } from '../../services/dashboardServices';

import { FaUsers, FaClipboardList, FaUserTie } from "react-icons/fa6"; // FaLastfmSquare
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';



const AdminDashboard = () => {
  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const COLORS = ['#00A9E0', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#FF5733', '#4CAF50',  '#8884d8']; // for randorm colors

  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    requests: 0,
    requestByStatus: {},
    requestByType: {},
    requestByMonth: [],
    requestByYear: {},
    requestByProvider: [],
  });
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // <-- Set loading true when starting to fetch data
        //  console.log("Fetching dashboard data..."); // Log the fetching process

        const response = await getAdminDashboardData();
        // console.log("Dashboard data:", response.data); // Log the fetched data
        if (response.success) {
          const { users, providers, requests, requestByStatus, requestByType, requestByMonth, requestByYear, requestByProvider } = response.data;

          setStats({
            users: users || 0,
            providers: providers || 0,
            requests: requests || 0,
            requestByStatus: requestByStatus || [],
            requestByType: requestByType || [],
            requestByMonth: requestByMonth || [],
            requestByYear: requestByYear || {},
            requestByProvider: requestByProvider || [],
          });
          // setStats(response.data); // <-- Set the state with the fetched data
        } else {
          console.error("Error fetching dashboard data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // <-- Always set loading false when done
      }
    };

    // fetchDashboardData();
    if (isLoggedIn) { /// && userRole === "admin"
      fetchDashboardData();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold pb-2"> Welcome to {loggedUser.name.charAt(0).toUpperCase() + loggedUser.name.slice(1)} Dashboard</h1>
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashStatCard title="Total Users" count={stats.users} icon={<FaUsers className="text-5xl" />} color={COLORS[0]} />
        <DashStatCard title="Total Providers" count={stats.providers} icon={<FaUserTie className="text-5xl" />} color={COLORS[1]} />
        <DashStatCard title="Total Requests" count={stats.requests} icon={<FaClipboardList className="text-5xl" />} color={COLORS[2]} />
      </div>

      {/* Graph section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Requests by Month (Bar Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Requests by Month</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.requestByMonth || []}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Requests by Status (Pie Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5 ">
          <div className="card-body">
            <h2 className="card-title">Requests by Status</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    // data={Object.entries(stats.requestByStatus).map(([name, value]) => ({ name, value }))}
                    // data={(stats.requestByStatus || []).map(({ _id, count }) => ({ name: _id, value: count }))}
                    data={(Array.isArray(stats.requestByStatus) ? stats.requestByStatus : []).map(({ _id, count }) => ({
                      name: _id,
                      value: count,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {Object.keys(stats.requestByStatus || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
      {/* End graph section */}


      {/* Top Providers Table */}
      <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5 mb-10">
        <div className="card-body">
          <h2 className="card-title mb-4">Top Providers</h2>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {stats.requestByProvider && stats.requestByProvider.length > 0 ? stats.requestByProvider.map((provider, index) => (
                  <tr key={index}>
                    <td>{provider.name}</td>
                    <td>{provider.count}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="text-center">No providers available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* End Top Providers Table */}



    </div>
  );
}

export default AdminDashboard;
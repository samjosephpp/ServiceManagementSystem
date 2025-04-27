import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import DashStatCard from "../shared/DashStatCard";
import { getProviderDashboardData } from '../../services/dashboardServices';

import { FaUsers, FaClipboardList, FaUserTie } from "react-icons/fa6"; // FaLastfmSquare
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {

  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({ id: null, name: null, providerId: null });
  const [loading, setLoading] = useState(false);
  const COLORS = ['#00A9E0', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#FF5733', '#4CAF50', '#8884d8']; // for randorm colors

  const [providerStats, setProviderStats] = useState({
    totalRequestCount:0,
    todayRequestCount:0,
    requestByStatus: [], // request count by status
    requestByType: [],   // request count by type
    requestByMonth: [],  // request count by month
    requestByYear: {},   // request count by year
    requestByProvider: [], // request count by provider
    requestByProviderAndStatus: [], // request count by provider and status
    requestByProviderAndType: [], // request count by provider and type
    requestByProviderAndMonth: [] // request count by provider and month
  });

  useEffect(() => {
    if (isLoggedIn && loggedUser) {
      setUserInfo({
        id: loggedUser._id,
        name: loggedUser.name,
        providerId: loggedUser.providerId,
      });
    } else {
      setError("User not logged in");
    }
  }, [isLoggedIn, loggedUser]);

  useEffect(() => {
    if (!userInfo.providerId) return; // Don't run until providerId is available

    // console.log("Fetching dashboard data for providerId:", userInfo.providerId); // Log the providerId being used

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getProviderDashboardData(userInfo.providerId);
        // console.log("Dashboard data:", response.data); // Log the fetched data
        if (response.success) {
          const { totalRequestCount, todayRequestCount, requestByStatus, requestByType, requestByMonth, requestByYear, requestByProvider, requestByProviderAndStatus, requestByProviderAndType, requestByProviderAndMonth } = response.data;

          setProviderStats({
            totalRequestCount: totalRequestCount || 0,
            todayRequestCount : todayRequestCount || 0,
            requestByStatus: requestByStatus || [],
            requestByType: requestByType || [],
            requestByMonth: requestByMonth || [],
            requestByYear: requestByYear || {},
            requestByProvider: requestByProvider || [],
            requestByProviderAndStatus: requestByProviderAndStatus || [],
            requestByProviderAndType: requestByProviderAndType || [],
            requestByProviderAndMonth: requestByProviderAndMonth || []
          });

        } else {
          console.error("Error fetching dashboard data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // <-- Always set loading false when done
      }
    };
    if (isLoggedIn) { /// && userRole === "admin"
      fetchDashboardData();
    }
  }, [userInfo.providerId]); // Add userInfo.providerId to the dependency array

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <DashStatCard title="Total Request" count={providerStats.totalRequestCount} icon={<FaClipboardList className="text-5xl" />} color={COLORS[1]} />
        <DashStatCard title="Todays Request" count={providerStats.todayRequestCount} icon={<FaClipboardList className="text-5xl" />} color={COLORS[5]} />

          </div>

      {/* Graph section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Request Count by Status (Pie Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Status</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={providerStats.requestByStatus || []}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={100}
                    label
                  >
                    {providerStats.requestByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 2. Request Count by Type (Bar Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Type</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%"  >
                <BarChart data={providerStats.requestByType || []}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 3. Request Count by Month (Bar Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Month</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerStats.requestByMonth || []}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 4. Request Count by Year (Bar Chart) */}
        <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Year</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerStats.requestByYear || []}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/*5. Request Count by Provider (Table) */}
        {/* <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Provider</h2>
            <div className="overflow-x-auto h-50">
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>Provider Name</th>
                    <th>Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {providerStats.requestByProvider.map((provider, index) => (
                    <tr key={index}>
                      <td>{provider.name}</td>
                      <td>{provider.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
        {/* 6. Request Count by Provider and Status (Table) */}
        {/* <div className="card bg-base-200 shadow-lg rounded-box border border-base-content/5">
          <div className="card-body">
            <h2 className="card-title">Request Count by Provider and Status</h2>
            <div className="overflow-x-auto">
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>Provider Name</th>
                    <th>Status</th>
                    <th>Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {providerStats.requestByProviderAndStatus.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry._id.providerName}</td>
                      <td>{entry._id.status}</td>
                      <td>{entry.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}



      </div>
      {/* End of Graph section */}





    </div>
  );
}

export default Dashboard;
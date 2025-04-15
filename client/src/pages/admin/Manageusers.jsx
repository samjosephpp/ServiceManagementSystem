import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllUsers, updateUser, removeUser } from "../../services/dataServices";
import {   FaRegTrashCan, FaFilePen } from "react-icons/fa6";

import { toast } from 'react-toastify';

const Manageusers = () => {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

  useEffect(() => {

    const fetchUsers = async () => {
      setLoading(true);
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data.data);

      } else {
        setError(response.message);
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  const handleUserStatusChange = async (userId, isActive, user) => {
    const confirmStatusChange = window.confirm(`Are you sure you want to change the status of "${user.name}"?`);
    if (!confirmStatusChange) {
      return;
    }
    const response = await updateUser(userId, { isActive: isActive });
    if (response.success) {
      toast.success(response.message);
      users.map((user) => {
        if (user._id === userId) {
          user.isActive = isActive;
        }
      });
      setUsers([...users]);
    } else {
      toast.error(response.message);
    }  
  }

  const handledeleteUser = async (userId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the user?`);
    if (!confirmDelete) {
      return;
    }
    const response = await removeUser(userId);
    if (response.success) {
      toast.success(response.message);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } else {
      toast.error(response.message);
    } 
   
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100" >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.stateId.name} - {user.locationId.name}  </td>
                  <td>{user.roleId.name} </td>
                  <td>
                    <input className="checkbox" type="checkbox" name="isActive" id="isActive" checked={user.isActive}
                      disabled={user._id === loggedUser._id || user.roleId.name === "Admin" ? true : false}
                      onChange={(e) => { handleUserStatusChange(user._id, e.target.checked, user); }} />
                  </td>
                  <td>
                    {/* <button className="btn btn-primary btn-sm mr-2">Edit</button> */}
                    {/* <button className="btn btn-error btn-sm" onClick={ handledeleteUser(user._id) } >Delete</button> */}
                    <button className="btn btn-error btn-sm" 
                     disabled={user._id === loggedUser._id || user.roleId.name === "Admin" ? true : false}
                    onClick={ () => { handledeleteUser(user._id) } } ><FaRegTrashCan></FaRegTrashCan></button>
                  </td>
                </tr>
              )
              )) : (<tr><td colSpan="7">No users found</td></tr>)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manageusers;
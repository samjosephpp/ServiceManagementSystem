import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { Form, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProviderUser, getAllProviderUsers } from "../../services/dataServices";


const AddProviderUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provider } = location.state || {};
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [providerUsers, setProviderUsers] = useState([]);

    // // const [searchParams] = useSearchParams();
    // // const providerId = searchParams.get("providerId") || provider?.id || null;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        // role: "",
        // locationId: "",
        // stateId: "",
        phone: "",
        address: "",
        providerId: provider?._id || null,
        providerObj: provider || null,
    });

    useEffect(() => {
        if (provider) {
            setFormData((prevData) => ({
                ...prevData,
                providerId: provider?._id || null,
                providerObj: provider || null,
            }));
            fetchProviderUsers(); // Fetch provider users when provider changes
        }
    }, [provider]);

    // Get all provider users
    const fetchProviderUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllProviderUsers(formData.providerId);
            if (response.success) {
                setProviderUsers(response.data.data);
            } else {
                toast.error(response.message || "Failed to fetch provider users");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while fetching provider users");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
            toast.error("Please fill all the fields");
            return;
        }
        const response = await createProviderUser(formData); //await getAllProviderUsers(formData.providerId, formData);
        if (response.success) {
            // toast.success(response.data.message);
            toast.success("User created successfully");
            setProviderUsers((prevUsers) => [...prevUsers, response.data.data]); // Add the new user to the list
            //navigate("/admin/manage-provider-users", { state: { provider: provider } });
            resetForm();
        } else {
            // toast.error(response.data.message);
            toast.error(response.message || "An error occured");
        }
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setLoading(false);
        setError(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            providerId: provider?._id || null,
            providerObj: provider || null,
        });
    };
    const handleReset = (e) => {
        e.preventDefault();
        resetForm();
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2> <span className="loading loading-spinner loading-lg  text-warning"></span></h2>
            </div>
        )
    }
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-red-500  ">Something went wrong!!!</h1>
                <p className="text-red-500" >{error}</p>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Provider details not available</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Manage "{provider.name}" Users</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-0">
                    <h6 className="text-xs font-bold uppercase   bg-gray-200 p-2  ">Add User</h6>
                    <form className="flex flex-col sm:flex-col md:flex-col lg:flex-col gap-2 p-2" onSubmit={handleSubmit}>

                        <div className="justify-center items-center pt-1 ">
                            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="name">Name</label>
                            <input type="text" className="input focus:outline-none" placeholder="Name" name="name" value={formData.name || ""}
                                // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onChange={handleChange}
                                required />
                            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="email">Email</label>
                            <input type="text" className="input focus:outline-none" placeholder="Email" name="email" value={formData.email || ""}
                                // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onChange={handleChange}
                                required />
                            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="password">Password</label>
                            <input type="password" className="input focus:outline-none" placeholder="Password" name="password" value={formData.password || ""}
                                // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onChange={handleChange}
                                required />
                            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="phone">Phone</label>
                            <input type="text" className="input focus:outline-none" placeholder="Phone" name="phone" value={formData.phone || ""}
                                // onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                onChange={handleChange}
                                required />
                            <label className="block text-gray-700 font-bold mb-2 text-xs" htmlFor="address">Address</label>
                            <input type="text" className="input focus:outline-none" placeholder="Address" name="address" value={formData.address || ""}
                                // onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                onChange={handleChange}
                                required />
                            <div className="space-y-2"></div>
                            <button className="btn btn-sm btn-success mt-4 mr-2">Create</button>
                            <button className="btn btn-sm btn-secondary mt-4" onClick={handleReset}>Reset</button>


                        </div>
                    </form>
                </div>
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-0">
                    <h6 className="text-xs font-bold uppercase   bg-gray-200 p-2  ">other users</h6>
                    <div className="box-content size-80 w-full overflow-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    {/* <th>Address</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {providerUsers.length > 0 ? (
                                    providerUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-100">
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            {/* <td>{user.address}</td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProviderUser;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';

import { getAllProviderServices } from "../../services/dataServices";
import { FaCircleCheck, FaCertificate, FaMedal, FaRegTrashCan, FaFilePen } from "react-icons/fa6";


const MyServices = () => {
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userproviderId, setUserProviderId] = useState(null);


    useEffect(() => {
        if (isLoggedIn && loggedUser) {
            setUserId(loggedUser._id);
            setUserName(loggedUser.name);
            setUserProviderId(loggedUser.providerId);
        } else {
            setError("User not logged in");
        }
    }, [isLoggedIn, loggedUser]);

    useEffect(() => {
        if (userproviderId) {
            setLoading(true);
            fetchServices(userproviderId);
        }
    }, [userproviderId]);

    const fetchServices = async (providerId) => {
        try {
            // console.log("providerId in fetchServices:", userproviderId);
            const providerServices = await getAllProviderServices(loggedUser.providerId);
            if (!providerServices) {
                // throw new Error("Failed to fetch services");
                setError("Failed to fetch services");
            }
            const data = providerServices.data.data;
            setServices(data);
            // console.log("Services:", data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    if (!isLoggedIn) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Please log in to view your services</h1>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2> <span className="loading loading-spinner loading-lg  text-warning"></span></h2>
            </div>
        )
    }
    if (error) {
        // return <p>Error: {error}</p>;
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-red-500  ">Something went wrong!!!</h1>
                <p className="text-red-500" >{error}</p>
            </div>
        );
    }


    return (
        <div className="container  mx-auto mt-5">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                <div className="flex items-center justify-between  bg-base-300 border border-base-300 rounded-lg p-4 mb-4">
                    <h2 className="text-lg font-bold">Services for {loggedUser.name.charAt(0).toUpperCase() + loggedUser.name.slice(1)}</h2>

                    {services.length > 0 ? (
                        <h3 className="text-md font-bold">
                            Showing {services.length} results.
                        </h3>
                    ) : (
                        <h3 className="text-md font-bold">
                            No services found.
                        </h3>
                    )}
                    {/* {selectedProvider && selectedProvider._id && (
                        <button className="btn btn-primary btn-sm ml-auto" id="addService" name="addService" onClick={handleAddService}   >   Add Service  </button>
                    )} */}
                </div>
                <table className="table w-full mt-4">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Location</th>
                            <th>Availability</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            services && services.length > 0 ? (
                                services.map((service) => (
                                    <tr key={service._id}>
                                        <td>{service.serviceCategoryId.name}</td>
                                        <td>{service.locationId.stateId.name} - {service.locationId.name}</td>
                                        <td>
                                            <div className="grid grid-flow-row auto-rows-max">
                                                <div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-xs font-semibold">Days</div>
                                                        <div className="text-xs">: {service.availabilityDays}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-xs font-semibold">Hours</div>
                                                        <div className="text-xs">: {service.availabilityHours}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-xs font-semibold">Time</div>
                                                        <div className="text-xs">: {service.availabilityTime}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-xs font-semibold">Available For</div>
                                                        <div className="text-xs">: {service.availabiltyFor}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>$ {service.rate}</td>
                                        <td>
                                            <FaCircleCheck className="text-xl inline-flex " style={{ color: service.isActive ? "green" : "red" }} />
                                            <FaCertificate className="text-xl  inline-flex" style={{ color: service.isApproved ? "green" : "red" }} />
                                        </td>
                                        <td></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">
                                    <div className="flex justify-center items-center h-32">
                                        <h3 className="text-md font-bold">No services found.</h3>
                                    </div>
                                </td></tr>
                            )
                        }
                    </tbody>
                </table>
                {services.length === 0 && (
                    <div className="flex justify-center items-center h-32">
                        <h3 className="text-md font-bold">No services found.</h3>
                    </div>
                )}


            </div>

        </div >
        // <div className="flex justify-center items-center h-screen">
        //     <h1 className="text-2xl font-bold">My Services</h1>
        // </div>
    );
}

export default MyServices;
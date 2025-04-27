import React, { useState, useEffect, useContext, use } from "react";
import { AuthContext } from '../../context/AuthContext';

import { toast } from 'react-toastify';

import { getAllProviders, getAllLocationsWithState, getAllServiceCategories, getAllServiceRequests, updateRequestStatusAndPayment } from "../../services/dataServices";
import { FaCircleCheck, FaCertificate, FaRegTrashCan, FaFilePen, FaEye } from "react-icons/fa6";
import EditRequestForm from "./EditRequestForm";


const Requests = () => {
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({ id: null, name: null, providerId: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showeditModal, setShowEditModal] = useState(false);


    const [serviceCategories, setServiceCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
    const [selectedRequestDate, setselectedRequestDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
    });
    // const [selectedRequestDate, setselectedRequestDate] = useState(null);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editedRequest, setEditedRequest] = useState(selectedRequest);


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
        const fetchServiceCategories = async () => {
            setLoading(true);
            const response = await getAllServiceCategories();
            if (response.success) {
                setServiceCategories(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };
        const fetchLocations = async () => {
            setLoading(true);
            const response = await getAllLocationsWithState();
            if (response.success) {
                setLocations(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }
        fetchServiceCategories();
        fetchLocations();
    }, []);

    //fetch service requests
    useEffect(() => {
        if (!userInfo.providerId) return; // Don't run until providerId is available

        // const selectedProvider = userInfo.providerId || " ";
        // console.log("providerId in fetchServiceRequests:", selectedProvider);
        // console.log(selectedRequestDate)

        const fetchServiceRequests = async () => {
            if (!selectedLocation && !selectedServiceCategory && !selectedRequestDate) {
                toast.error("Missing location, service category, or request date in filter.");
                return;
            };
            setLoading(true);
            const filters = {
                ...(userInfo.providerId && { providerId: userInfo.providerId }),
                ...(selectedLocation && { locationId: selectedLocation }),
                ...(selectedServiceCategory && { serviceCategoryId: selectedServiceCategory }),
                ...(selectedRequestDate && { requestDate: selectedRequestDate }),
            };

            const response = await getAllServiceRequests(filters);

            //const response = await getAllServiceRequests({ providerId: selectedProvider, locationId: selectedLocation, serviceCategoryId: selectedServiceCategory, requestDate: selectedRequestDate });
            // console.log("response", response);
            if (response.success) {
                setServiceRequests(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }
        fetchServiceRequests();

    }, [selectedLocation, selectedServiceCategory, selectedRequestDate, userInfo.providerId]);

    const handleModalview = (requestId) => {
        const selectedRequest = serviceRequests.find((request) => request._id === requestId);
        setSelectedRequest(selectedRequest);
        setShowModal(true);
        // console.log("selectedRequest", selectedRequest);
    }
    function closeModal() {
        setShowModal(false);
        setSelectedRequest(null);
    }

    const handleEditRequest = (requestId) => {
        const selectedRequest = serviceRequests.find((request) => request._id === requestId);
        setSelectedRequest(selectedRequest);
        setShowEditModal(true);
        // console.log("selectedRequest", selectedRequest);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setSelectedRequest(null);
    }
    const handleEditSubmit = async (e  ) => {
        e.preventDefault();
        console.log("editedRequest", selectedRequest);
        const response = await updateRequestStatusAndPayment( {_id: selectedRequest._id, status: selectedRequest.status, isPaid: selectedRequest.isPaid });
        console.log("response after edit", response);
        if (response.success) {
            toast.success("Request updated successfully");
            setServiceRequests((prevRequests) =>
                prevRequests.map((request) => (request._id === selectedRequest._id ? { ...request, status: selectedRequest.status, isPaid: selectedRequest.isPaid } : request))
            );
        } else {
            toast.error(response.message);   
        }
        closeEditModal();
    }

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Services Request</h1>
            <fieldset className="fieldset w-full bg-base-300 border border-base-300 p-5">
                <div className="form-control flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="fieldset-label">Select Location</label>
                        <select className="select select-bordered w-full max-w-xs focus:outline-none" //defaultValue=" "
                            value={selectedLocation || ""}
                            onChange={(e) => setSelectedLocation(e.target.value)}   >
                            <option value="">Filter by...</option>
                            {locations.map((location) => (
                                <option key={location._id} value={location._id} > {location.stateId.name} - {location.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="fieldset-label">Service Category</label>
                        <select className="select select-bordered w-full max-w-xs focus:outline-none" //defaultValue=" "
                            value={selectedServiceCategory || ""}
                            onChange={(e) => setSelectedServiceCategory(e.target.value)} >
                            <option value="">Filter by...</option>
                            {serviceCategories.map((category) => (
                                <option key={category._id} value={category._id} >{category.name}- {category.isActive ? "Active" : "Inactive"}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="fieldset-label">Request Date</label>
                        <input type="date" className="input w-full max-w-xs focus:outline-none"
                            value={selectedRequestDate || ""}
                            onChange={(e) => setselectedRequestDate(e.target.value)} />
                    </div>
                </div>
            </fieldset>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                <div className="flex items-center justify-between">
                    <table className="table w-full table-zebra">
                        <thead>
                            <tr>
                                <th>Request Date</th>
                                <th>Customer</th>
                                <th>Location</th>
                                <th>Service</th>
                                <th>Amount ($)</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceRequests && serviceRequests.length > 0 ? serviceRequests.map((request) => (
                                <tr key={request._id}>
                                    <td>{new Date(request.createdAt).toLocaleDateString('en-GB')}</td>
                                    <td>{(request.createdBy && request.createdBy.clientId ? request.createdBy.clientId.name : '')}</td>
                                    <td>{request.stateId.name}-{request.locationId.name}</td>
                                    <td>{request.providerServiceId.serviceCategoryId.name}</td>
                                    <td>{request.amount}</td>
                                    <td>
                                        {request.status === 'Pending' && <span className="badge badge-warning"  >{request.status}</span>}
                                        {request.status === 'Accepted' && <span className="badge badge-info">{request.status}</span>}
                                        {request.status === 'Declined' && <span className="badge badge-error">{request.status}</span>}
                                        {request.status === 'Completed' && <span className="badge badge-success">{request.status}</span>}

                                    </td>
                                    <td>
                                        {request.isPaid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-error">Not Paid</span>}
                                    </td>
                                    <td>
                                        <button className="btn btn-primary btn-xs" value={request._id} onClick={() => handleModalview(request._id)} ><FaEye /></button>
                                        { (request.status === 'Pending' || request.status === 'Accepted') && <button className="btn btn-secondary btn-xs" value={request._id} onClick={() => handleEditRequest(request._id)} ><FaFilePen /></button>}
                                    </td>
                                </tr>

                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <div className="flex justify-center items-center h-32">
                                            <h3 className="text-md font-bold">No service requests found.</h3>
                                        </div>
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                {showModal && selectedRequest && (
                    <dialog open className="modal">
                        <div className="modal-box w-11/12 max-w-5xl bg-white rounded-lg shadow-lg p-6">
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <h3 className="font-bold text-2xl text-gray-800 text-center w-full md:w-auto mb-2 md:mb-0">
                                    Request Details
                                </h3>
                                <p className="text-gray-600 text-sm text-center w-full md:w-auto">
                                    <strong>Request Number:</strong> {selectedRequest.requestNumber}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1  xs:grid-cols-1  gap-4">
                                <div >
                                    <p><strong className="text-gray-600">Customer:</strong> <span className="text-gray-800">{(selectedRequest.createdBy && selectedRequest.createdBy.clientId ? selectedRequest.createdBy.clientId.name : '')}</span></p>
                                    <p><strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{(selectedRequest.createdBy && selectedRequest.createdBy.clientId ? selectedRequest.createdBy.clientId.email : '')}</span></p>
                                    <p><strong className="text-gray-600">Phone:</strong> <span className="text-gray-800">{(selectedRequest.createdBy && selectedRequest.createdBy.clientId ? selectedRequest.createdBy.clientId.phone : '')}</span></p>
                                    <p><strong className="text-gray-600">Location:</strong> <span className="text-gray-800">{selectedRequest.stateId.name}, {selectedRequest.locationId.name}</span></p>
                                    <p><strong className="text-gray-600">Address:</strong></p>
                                    <p className="text-gray-800">{selectedRequest.address}</p>
                                    <p><strong className="text-gray-600">Amount:</strong> <span className="text-gray-800">${selectedRequest.amount}</span></p>
                                    <p><strong className="text-gray-600">Status:</strong> <span className={`badge ${selectedRequest.status === 'Pending' ? 'badge-warning' : selectedRequest.status === 'Accepted' ? 'badge-info' : selectedRequest.status === 'Declined' ? 'badge-error' : 'badge-success'}`}>{selectedRequest.status}</span></p>
                                    <p><strong className="text-gray-600">Is Paid:</strong> <span className={`badge ${selectedRequest.isPaid ? 'badge-success' : 'badge-error'}`}>{selectedRequest.isPaid ? "Yes" : "No"}</span></p>
                                    <p><strong className="text-gray-600">Created At:</strong> <span className="text-gray-800">{new Date(selectedRequest.createdAt).toLocaleDateString('en-GB')}</span></p>
                                </div>
                                <div  >
                                    <p><strong className="text-gray-600">Service:</strong> <span className="text-gray-800">{selectedRequest.providerServiceId.serviceCategoryId.name}</span></p>
                                    <p><strong className="text-gray-600">Availability Days:</strong> <span className="text-gray-800">{selectedRequest.providerServiceId.availabilityDays === "Both" ? "Weekdays and Weekends" : selectedRequest.providerServiceId.availabilityDays}</span></p>
                                    <p><strong className="text-gray-600">Availability Time:</strong> <span className="text-gray-800">{selectedRequest.providerServiceId.availabilityTime}</span></p>
                                    <p><strong className="text-gray-600">Availability Hours:</strong> <span className="text-gray-800">{selectedRequest.providerServiceId.availabilityHours}</span></p>
                                    <p><strong className="text-gray-600">Availability For:</strong> <span className="text-gray-800">{selectedRequest.providerServiceId.availabiltyFor}</span></p>
                                </div>
                                <div  >
                                    <p><strong className="text-gray-600">Provider:</strong> <span className="text-gray-800">{selectedRequest.providerId.name}</span></p>
                                    <p><strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{selectedRequest.providerId.email}</span></p>
                                </div>
                                <div  >
                                    <p><strong className="text-gray-600">Remarks:</strong> <span className="text-gray-800">{selectedRequest.remarks}</span></p>

                                </div>
                            </div>
                            <div className="modal-action mt-6">
                                <button className="btn btn-primary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </dialog>
                )}
                {showeditModal && selectedRequest && (
                    <dialog open id="my_modal_2" className="modal ">
                        <div className="modal-box w-11/12 max-w-5xl bg-white rounded-lg shadow-lg p-6">
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <h3 className="font-bold text-2xl text-gray-800 text-center w-full md:w-auto mb-2 md:mb-0">  Edit Request  </h3>
                                <p className="text-gray-600 text-sm text-center w-full md:w-auto">
                                    <label className="inline-block text-gray-700 font-bold mb-2 uppercase">Request Number: {selectedRequest.requestNumber} </label>
                                </p>
                            </div>
                            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2 " id="gridForm">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="requestStatus"> Request Status </label>
                                        <select className="select select-bordered w-full max-w-xs focus:outline-none" id="requestStatus" name="requestStatus"
                                            value={selectedRequest.status}
                                            onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}>
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Declined">Declined</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="isPaid">Is Paid</label>
                                        <select className="select select-bordered w-full max-w-xs focus:outline-none" id="isPaid" name="isPaid"
                                            value={selectedRequest.isPaid}
                                            onChange={(e) => setSelectedRequest({ ...selectedRequest, isPaid: e.target.value })}>
                                            <option value="true">Yes</option>
                                            <option value="false" disabled >No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-action mt-6">
                                    <button type="submit" className="btn btn-success">Save Changes</button>
                                    <button className="btn btn-primary" onClick={closeEditModal}>Close</button>
                                </div>
                            </form>

                        </div>

                    </dialog>

                )}


            </div>
        </div>
    );

}

export default Requests;
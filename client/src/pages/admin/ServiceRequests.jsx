import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllProviders, getAllLocationsWithState, getAllServiceCategories, getAllServiceRequests } from "../../services/dataServices";
import { FaCircleCheck, FaCertificate, FaRegTrashCan, FaFilePen, FaEye } from "react-icons/fa6";

const ServiceRequests = () => {

    const [providers, setProviders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
    const [selectedRequestDate, setselectedRequestDate] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);


    useEffect(() => {

        const fetchProviders = async () => {
            setLoading(true);
            const response = await getAllProviders();
            if (response.success) {
                setProviders(response.data.data);
            } else {
                setError('Failed to fetch providers');
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

        const fetchServiceCategories = async () => {
            setLoading(true);
            const response = await getAllServiceCategories();
            if (response.success) {
                setServiceCategories(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }

        fetchProviders();
        fetchLocations();
        fetchServiceCategories();

    }, []);

    useEffect(() => {
        // console.log(selectedProvider, selectedLocation, selectedServiceCategory, selectedRequestDate);
        const fetchServiceRequests = async () => {
            setLoading(true);
            const response = await getAllServiceRequests({ providerId: selectedProvider, locationId: selectedLocation, serviceCategoryId: selectedServiceCategory, requestDate: selectedRequestDate });
            // console.log("response", response);
            if (response.success) {
                setServiceRequests(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }
        fetchServiceRequests();
    }, [selectedProvider, selectedLocation, selectedServiceCategory, selectedRequestDate]);
 
    const handleModalview = (requestId) => {
        const request = serviceRequests.find(request => request._id === requestId);
        setSelectedRequest(request);
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
        setSelectedRequest(null);
    }



    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Services Request</h1>
            <fieldset className="fieldset w-full bg-base-300 border border-base-300 p-5">
                <div className="form-control flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="fieldset-label">Select Provider:</label>
                        <select className="select select-bordered w-full max-w-xs focus:outline-none" defaultValue=" "
                            onChange={(e) => setSelectedProvider(e.target.value)}
                        >
                            <option value="">Filter by...</option>
                            {providers.map((provider) => (
                                <option key={provider._id} value={provider._id} >{provider.name}</option>
                            ))
                            }
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="fieldset-label">Select Location</label>
                        <select className="select select-bordered w-full max-w-xs focus:outline-none" defaultValue=" "
                            onChange={(e) => setSelectedLocation(e.target.value)}   >
                            <option value="">Filter by...</option>
                            {locations.map((location) => (
                                <option key={location._id} value={location._id} > {location.stateId.name} - {location.name}</option>
                            ))}
                        </select>

                    </div>
                    <div className="flex-1">
                        <label className="fieldset-label">Service Category</label>
                        <select className="select select-bordered w-full max-w-xs focus:outline-none" defaultValue=" "
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
                            onChange={(e) => setselectedRequestDate(e.target.value)} />
                    </div>
                </div>
            </fieldset>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                <div className="flex items-center justify-between">
                    {selectedProvider && (
                        <h3 className="text-md font-bold">
                            {/* Showing {selectedProviderServices.length} results for {selectedProvider.name} */}
                        </h3>
                    )}
                </div>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Request Date</th>
                            <th>Provider</th>
                            <th>Customer</th>
                            <th>Location</th>
                            <th>Service</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceRequests && serviceRequests.length > 0 ? serviceRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{new Date(request.createdAt).toLocaleDateString('en-GB')}</td>
                                <td>{request.providerId.name}</td>
                                <td>{  ( request.createdBy && request.createdBy.clientId ? request.createdBy.clientId.name : '' )}</td>
                                <td>{request.stateId.name}-{request.locationId.name}</td>
                                <td>{request.providerServiceId.serviceCategoryId.name}</td>
                                <td>{request.amount}</td>
                                <td>
                                    {request.status === 'Pending' && <span className="badge badge-warning">{request.status}</span>}
                                    {request.status === 'Accepted' && <span className="badge badge-info">{request.status}</span>}
                                    {request.status === 'Declined' && <span className="badge badge-error">{request.status}</span>}
                                    {request.status === 'Completed' && <span className="badge badge-success">{request.status}</span>}

                                </td>
                                <td><button className="btn btn-primary btn-xs" value={request._id} onClick={() => handleModalview(request._id)} ><FaEye /></button> </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="text-center">No service requests found.</td>
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



        </div>


        // <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        // <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
        // <p className="text-gray-600">No service requests available at the moment.</p>
        // </div>
    );
}

export default ServiceRequests;
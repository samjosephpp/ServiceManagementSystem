import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getServiceRequestsByUserOrProvider } from '../../services/dataServices';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import {  Link, useNavigate } from 'react-router-dom';

const MyRequests = () => {

    const [serviceRequests, setServiceRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
    const navigate = useNavigate();
    // console.log(loggedUser)


    useEffect(() => {
        const fetchServiceHistory = async () => {
            setLoading(true);
            const response = await getServiceRequestsByUserOrProvider({ userId: loggedUser._id });
            if (response.success) {

                setServiceRequests(response.data.data);
                // console.log(response.data);
                // console.log(serviceRequests); 
            } else {
                setError(response.message);
            }
            setLoading(false);
        }
        fetchServiceHistory()
    }, []);

    function handlePayment (request) {
        setSelectedRequest(request);
        navigate('/payment', { state: { request } }); // Navigate to Payment.jsx with request as state
    }

    if (loading) {
        return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    function handleModalview(requestId) {
        const request = serviceRequests.find(request => request._id === requestId);
        setSelectedRequest(request);
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
        setSelectedRequest(null);
    }

    return (
        <div className="container mx-auto justify-center items-center ">
            <h1 className="text-3xl font-bold text-left mb-6 pt-6">My Requests</h1>
            <h4 className="p-4">Showing {serviceRequests.length} results</h4>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Service</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Is Paid</th>
                            <th>Created At</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            serviceRequests && serviceRequests.length > 0 ? (
                                serviceRequests.map((request) => (
                                    <tr key={request._id}>
                                        <td>{request.providerId.name}</td>
                                        <td>{request.providerServiceId.serviceCategoryId.name}</td>
                                        <td>${request.amount}</td>
                                        <td>
                                            {request.status === 'Pending' && <span className="badge badge-warning">{request.status}</span>}
                                            {request.status === 'Accepted' && <span className="badge badge-info">{request.status}</span>}
                                            {request.status === 'Declined' && <span className="badge badge-error">{request.status}</span>}
                                            {request.status === 'Completed' && <span className="badge badge-success">{request.status}</span>}
                                        </td>
                                        <td>
                                            {request.isPaid === true && <span className="badge badge-success">Yes</span>}
                                            {request.isPaid === false && <span className="badge badge-error">No</span>}
                                        </td>
                                        <td> {new Date(request.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td>
                                            <button className="btn btn-primary btn-xs" value={request._id} onClick={() => handleModalview(request._id)} >View</button>
                                            {( (request.status === 'Pending' || request.status === 'Accepted') && !request.isPaid ) && (
                                                <button className="btn btn-error btn-xs ml-2" onClick={() => handlePayment(request)}><FaMoneyBillTransfer className="inline-block mr-1 text-xs" /></button>
                                            )}

                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <p className="text-gray-600" >No requests found. </p>

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
    );
};

export default MyRequests;
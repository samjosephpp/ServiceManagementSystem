import React, { useState, useEffect, useContext } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaClock, FaCalendarDay } from "react-icons/fa6";
import { AuthContext } from '../../context/AuthContext';
import { saveFeedback } from "../../services/dataServices";

const Feedback = () => {
    const location = useLocation();
    const { request } = location.state || {}; // Retrieve the service object
    const [selectedRequest, setSelectedRequest] = useState(request);
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

    // console.log(request);

    const [feedbackId, setFeedbackId] = useState('');
    const [feedback, setFeedback] = useState('');
    const [formData, setFormData] = useState({
        userId: loggedUser._id || '',
        requestId: request._id || '',
        rating: 0,
        comment: '',
    });

    useEffect(() => {
        if (selectedRequest) {
            setFormData({
                ...formData,
                requestId: selectedRequest._id || '',
                userId: loggedUser._id || '',
            });            
        }
    }, [selectedRequest])

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formData.rating || !formData.comment) {
            toast.error('Please fill your comment and select the rating');
            return;
        }
        // console.log("formData", formData);
        const response = await saveFeedback(formData);
        console.log("response", response);
        if (response.success) {
            setFeedbackId(response.data.data._id);
            setFeedback(response.data.data);
            toast.success("Feedback submitted successfully", {
                closeOnClick: true,
                pauseOnHover: true
            });
            // setFeedbackId('100');
        }
        else {
            toast.error(`Feedback not submitted!. ${response.message}`, {                
                closeOnClick: true,
                pauseOnHover: true,
            });
        } 
    }

    return (<div>
        {!feedbackId ? (
            <div className="container mx-auto justify-center items-center p-4" >
                <h1 className="text-2xl font-bold text-left pt-6">Service Feedback </h1>
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2 text-sm font-bold " id="gridForm">
                            <div  >
                                <label htmlFor="requestNumber">Request Number:</label>
                                <input type="text" id="requestNumber" value={selectedRequest.requestNumber} className="input input-bordered w-full font-bold" disabled />

                            </div>
                            <div>
                                <label htmlFor="serviceName" className="label">Service Name:</label>
                                <input type="text" id="serviceName" value={selectedRequest.providerServiceId.serviceCategoryId.name} className="input input-bordered w-full" disabled />
                            </div>
                            <div>
                                <label htmlFor="serviceProvider" className="label">Service Provider:</label>
                                <input type="text" id="serviceProvider" value={selectedRequest.providerId.name} className="input input-bordered w-full" disabled />
                            </div>
                            <div>
                                <span className="label">Service Location:</span>
                                <span className="input input-bordered w-full " disabled >{selectedRequest.stateId.name} - {selectedRequest.locationId.name}</span >
                            </div>
                            <div>
                                <span className="label">Service Availability:</span>
                                <div className="grid grid-cols-4 gap-2 border-t border-b border-gray-200 py-2 divide-x divide-gray-200">
                                    <div className="flex items-center">
                                        <FaCalendarDay className="inline-block mr-1 text-indigo-500" />
                                        {selectedRequest.providerServiceId.availabilityDays === "Weekdays" ? "WeekDays" : selectedRequest.providerServiceId.availabilityDays === "Both" ? "Weekend & WeekDays" : selectedRequest.providerServiceId.availabilityDays}
                                    </div>
                                    <div> <FaClock className="inline-block mr-1" />  {selectedRequest.providerServiceId.availabilityHours}  </div>
                                    <div>{selectedRequest.providerServiceId.availabilityTime}</div>
                                    <div>{selectedRequest.providerServiceId.availabiltyFor}</div>
                                </div>
                            </div>
                            <div>
                                <span className="label">Requested Date:</span>
                                <span className="input input-bordered w-full " disabled >{new Date(selectedRequest.createdAt).toLocaleDateString('en-GB')}  </span >
                            </div>
                            <div>
                                <span className="label">Your Comment:</span>
                                <div>  <textarea name="comment" className="textarea textarea-bordered h-24 w-full focus:outline-none" placeholder="Your Comment" onChange={(e) => setFormData({ ...formData, comment: e.target.value })} required></textarea>
                                </div>
                            </div>
                            <div>
                                <span className="label pt-5">Rating:</span>
                                <div className="rating">
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" onClick={() => setFormData({ ...formData, rating: 1 })} />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" onClick={() => setFormData({ ...formData, rating: 2 })} />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" onClick={() => setFormData({ ...formData, rating: 3 })} />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" onClick={() => setFormData({ ...formData, rating: 4 })} />
                                    <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" onClick={() => setFormData({ ...formData, rating: 5 })} />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        ) : (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Service Feedback Saved Successfully!</h1>
                <p className="text-lg">Thank you for your feedback</p>
                <div className="justify-center card-actions">
                    <Link to="/" className="mt-4 text-green-950 hover:underline-none  btn btn-md btn-success">
                        Go back to Homepage
                    </Link>
                </div>
            </div>
            // <>
            //     <div className="container mx-auto justify-center items-center " >
            //         <h1 className="text-3xl font-bold text-left mb-6 pt-6">Service Feedback </h1>
            //     </div>
            //     <div className="container mx-auto justify-center items-center " >
            //         <h1 className="text-3xl font-bold text-left mb-6 pt-6">Thank you for your feedback</h1>
            //     </div>
            // </>
        )}
    </div>);
};

export default Feedback;
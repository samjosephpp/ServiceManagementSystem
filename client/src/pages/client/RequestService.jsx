import React, { useState, useEffect } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';
import { createServiceRequest } from '../../services/dataServices'

const RequestService = () => {

    const location = useLocation();
    const { service } = location.state || {}; // Retrieve the service object
    // console.log(service);

    const [request_id, setRequest_id] = useState('');
    const [requestNumber, setRequestNumber] = useState('');

    // Initialize form data state with service values or default empty values
    const [formData, setFormData] = useState({

        _id: service?._id || '',
        providerId: service?.providerId || '',
        providerServiceId: service?._id || '',
        // stated: service?.stated || '',
        locationId: service?.locationId || '',
        address: service?.address || '',
        amount: service?.rate || '',
        remarks: service?.remarks || ''
    });
    // Update form state if service data changes
    useEffect(() => {
        if (service) {
            setFormData({
                _id: service?._id || '',
                providerId: service.providerId || '',
                providerServiceId: service._id || '',
                // stated: service.stated || '',
                locationId: service.locationId || '',
                address: service.address || '',
                amount: service.rate || '',
                remarks: service.remarks || ''
            });
        }
    }, [service]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.providerId || !formData.providerServiceId || !formData.locationId || !formData.amount || !formData.address.trim()) {
            toast.error('Please fill in all required fields.');
            return;
        }
        // Generate a unique request_id  (replace with actual API call)
        // const uniqueRequestId = `REQ-${Date.now()}`;
        // setRequest_id(uniqueRequestId);
        // setRequestNumber(uniqueRequestId);

        const apiResponse = await createServiceRequest(formData ); 
        if (apiResponse.success) {           
            setRequest_id(apiResponse.data.data._id);
            setRequestNumber(apiResponse.data.data.requestNumber);
        }
        else {
            toast.error(`Request not saved! ${apiResponse.message} `);
        } 
    };

    return (
        <div className="max-w-xl mx-auto p-5">

            {!request_id ? (
                <>
                   
                    <h1 className="text-3xl font-bold text-center mb-6">Service Request Form</h1>
                   
                    <div className="flex justify-center items-center ">
                        <div className="p-6 bg-base-100 rounded-lg shadow-lg max-w-lg w-full">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Provider ID */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Provider</span>
                                    </label>
                                    <input type="text" disabled className="input input-bordered w-full" name="providerName" value={service.providerId.name} />
                                    <input
                                        type="hidden"
                                        name="providerId"
                                        value={formData.providerId}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter Provider ID"
                                    />
                                </div>
                                {/* Provider Service ID */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Service</span>
                                    </label>
                                    <input type="text" disabled className="input input-bordered w-full" name="ServiceName" value={service.serviceCategoryId.name} />
                                    <input
                                        type="hidden"
                                        name="providerServiceId"
                                        value={formData.providerServiceId}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter Provider Service ID"
                                    />
                                </div>

                                {/* Stated */}
                                {/* <div className="form-control">
                            <label className="label">
                                <span className="label-text">Stated</span>
                            </label>
                            <input
                                type="text"
                                name="stated"
                                value={formData.stated}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder="Enter Stated"
                            /> {service.locationId.stateId.name} - {service.locationId.name}
                        </div> */}

                                {/* Location ID */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Location</span>
                                    </label>
                                    <input type="text" disabled className="input input-bordered w-full" name="LocationName" value={`${service.locationId.stateId.name} - ${service.locationId.name}`} />
                                    <input
                                        type="hidden"
                                        name="locationId"
                                        value={formData.locationId}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter Location ID"
                                    />
                                </div>

                                {/* Amount */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Amount ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter Amount"
                                        disabled
                                    />
                                </div>

                                {/* Address */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Address</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full validator"
                                        placeholder="Enter Address"
                                        required 
                                    />
                                    <div className="validator-hint hidden">Address Required</div>
                                </div>



                                {/* Remarks */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Remarks</span>
                                    </label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Enter Remarks"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="form-control">
                                    <button type="submit" className="btn btn-outline btn-info w-full">  Submit </button>
                                    <input
                                        type="hidden"
                                        name="_id"
                                        value={formData._id}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                    />
                                    <input
                                        type="hidden"
                                        name="request_id"
                                        value={formData.request_id}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                    />

                                </div>

                            </form>

                        </div>
                    </div>
                </>) : (
                <div className="flex flex-col justify-center items-center h-screen">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Service Request Form Saved Successfully!</h1>
                    <p className="text-lg">Your service request has been saved.</p>
                    <p className="text-md">Request Number : {requestNumber}</p>
                </div>
            )}

        </div>

    )

}

export default RequestService;
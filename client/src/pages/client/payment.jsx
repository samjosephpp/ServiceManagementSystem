import React, { useState, useEffect } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaCalendarDay } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { savePayment } from "../../services/dataServices";
import { toast } from 'react-toastify';

const Payment = () => {

    const location = useLocation();
    const { request } = location.state || {}; // Retrieve the service object
    const [selectedRequest, setSelectedRequest] = useState(request);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [paymentId, setPaymentId] = useState(null);
    const [payId, setPayId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Debit');

    // console.log(selectedRequest);

    const methods = [
        { label: 'Debit Card', value: 'Debit' },
        { label: 'Credit Card', value: 'Credit' },
        { label: 'GPay', value: 'GPay' },
        { label: 'ApplePay', value: 'ApplePay' },
    ];
    const [formData, setFormData] = useState({
        requestId: selectedRequest._id || '',
        paymentId: paymentId || '',
        paymentMethod: '',
        cardHolder: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        referenceNumber: '',
        amount: selectedRequest.amount || '',
        paymentStatus: 'Pending',
        paymentDate: new Date(),
    });

    useEffect(() => {
        if (selectedRequest) {
            setFormData({
                ...formData,
                requestId: selectedRequest._id,
                amount: selectedRequest.amount,
            });
        }
    }, [selectedRequest]); // Add selectedRequest as a dependency
    useEffect(() => {
        setFormData({ ...formData, paymentMethod: paymentMethod, cardCvv: '', cardExpiry: '', cardHolder: '', cardNumber: '', referenceNumber: '' });
    }, [paymentMethod]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log("formData", formData);

        // Perform validation here if needed
        if (!paymentMethod) {
            toast.error("Please select a payment method", {
                hideProgressBar: false,
                closeOnClick: true
            });
            setLoading(false);
            return;
        }
        if (formData.paymentMethod === 'Debit' || formData.paymentMethod === 'Credit') {
            if (!formData.cardHolder || !formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
                toast.error("Please fill in all required card details", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false);
                return;
            }
        }
        if (!['Debit', 'Credit'].includes(formData.paymentMethod)) {
            if (!formData.referenceNumber) {
                toast.error("Please provide a reference number", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false);
                return;
            }
        }

        setIsSubmitting(true); // Start loading spinner
        // Call your payment API here with formData

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay
            const response = await savePayment(formData);
            if (!response.success) {
                setError(response.message);
                toast.error(`Payment Failed ${response.message}`, {
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                // setLoading(false);
                // return;
            }
            else {
                toast.success("Payment Successful", {
                    closeOnClick: true,
                    pauseOnHover: true
                });
                setPayId(response.data.data._id);
                setPaymentId(response.data.data.paymentId);
            }
        } catch (error) {
            setError(error.message);
            toast.error(`Payment Failed ${error.message}`, {
                closeOnClick: true,
                pauseOnHover: true,
            });
        } finally {
            setLoading(false);
            setIsSubmitting(false); // Stop loading spinner
        }

    }

    return (
        <div >
            {!paymentId && !payId ? (
                <>
                    <div className="container mx-auto justify-center items-center ">
                        <h1 className="text-3xl font-bold text-left mb-6 pt-6">Service Request Payment </h1>
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2 text-sm font-bold " id="gridForm">
                                    <div className="col-span-full">
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
                                        <label htmlFor="serviceProvider" className="label">Service Provider Email:</label>
                                        <input type="text" id="serviceProvider" value={selectedRequest.providerId.email} className="input input-bordered w-full" disabled />
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
                                        <span className="label">Amount to pay ($):</span>
                                        <span className="input input-bordered w-full text-xl text-green-600 "  >{selectedRequest.amount}</span >
                                    </div>
                                    <div>
                                        <span className="label">Payment Method:</span>
                                        <div>
                                            <div className="space-y-2">
                                                {methods.map((method) => (
                                                    <label
                                                        key={method.value}
                                                        className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer shadow-md transition-all duration-300 ${paymentMethod === method.value ? 'bg-blue-100 border-blue-500' : 'bg-white hover:shadow-lg'
                                                            }`}
                                                    >
                                                        <span className="text-lg font-medium">{method.label}</span>
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={method.value}
                                                            className="radio checked:bg-blue-500"
                                                            checked={paymentMethod === method.value}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="label">Payment Details:</span>
                                        {/* Show Credit Card Inputs */}
                                        {(paymentMethod === 'Debit' || paymentMethod === 'Credit') && (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    placeholder="Card Holder Name"
                                                    className="input input-bordered w-full outline-none focus:outline-none "
                                                    value={formData.cardHolder}
                                                    onChange={handleInputChange}
                                                />
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    placeholder="Card Number"
                                                    className="input input-bordered w-full outline-none focus:outline-none "
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    maxLength={16}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Allow only digits
                                                />
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        name="cardExpiry"
                                                        placeholder="MM/YY"
                                                        className="input input-bordered w-full outline-none focus:outline-none "
                                                        value={formData.cardExpiry}
                                                        // onChange={handleInputChange}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value;
                                                            const formatted = rawValue
                                                                .replace(/[^\d]/g, '')        // Only digits
                                                                .replace(/^(\d{2})(\d{1,2})?/, (_, m1, m2) => (m2 ? `${m1}/${m2}` : m1)); // Format as MM/YY
                                                            if (formatted.length <= 5) {
                                                                //   setFormData({ ...formData, cardExpiry: formatted });
                                                                handleInputChange({ target: { name: 'cardExpiry', value: formatted } });
                                                            }
                                                        }}
                                                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                                                        maxLength={5}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="cardCvv"
                                                        placeholder="CVV"
                                                        className="input input-bordered w-full outline-none focus:outline-none "
                                                        value={formData.cardCvv}
                                                        onChange={handleInputChange}
                                                        pattern="\d{3}"
                                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Allow only digits
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {/* Show Reference Number Input for PayPal or COD */}
                                        { //(paymentMethod === 'GPay' || paymentMethod === 'ApplePay' || paymentMethod === 'cod') && (
                                            paymentMethod &&
                                            paymentMethod !== 'Debit' &&
                                            paymentMethod !== 'Credit' && (
                                                <div className="mt-4">
                                                    <input
                                                        type="text"
                                                        name="referenceNumber"
                                                        placeholder="Reference Number"
                                                        className="input input-bordered w-full outline-none focus:outline-none  "
                                                        value={formData.referenceNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            )}

                                    </div>
                                    <div className="col-span-full">
                                        {/* <button type="submit" className="btn btn-primary w-full" > Pay Now</button> */}
                                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <span className="loading loading-spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (  'Pay Now'  )}
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col justify-center items-center h-screen">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successfully Processed!</h1>
                    <div className="card  card-side bg-base-100 shadow-sm  hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out">
                        <div className="card-body">
                            <h2 className="card-title">Payment Summary</h2>
                            <p className="text-md">Payment Number : {paymentId}</p>
                            <p className="text-md">Payment ID : {payId}</p>
                            <p className="text-md">Payment Method : {formData.paymentMethod}</p>
                            <p className="text-md">Payment Date : {new Date().toLocaleString()}</p>
                            <div className="justify-center card-actions">
                                <Link to="/" className="mt-4 text-green-950 hover:underline-none  btn btn-md btn-success">
                                    Go back to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

        </div>



    );
}

export default Payment;
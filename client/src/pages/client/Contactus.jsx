import React from "react";
import { FaMapLocation , FaHeadset, FaEnvelopeOpen} from "react-icons/fa6";
 

const Contactus = () => {
    return (
        <div className="bg-base-100 text-base-content">
            <section className="container mx-auto my-12 p-6 text-center ">
                <h2 className="text-3xl font-bold text-blue-900">Contact Information</h2>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                <div className="card bg-base-200  p-4 shadow-amber-500 shadow-md " >
                    <div className="card-body flex flex-col items-center">
                        <FaEnvelopeOpen className="text-5xl mb-4"  />
                        <h2 className="card-title">Email Us</h2>
                        <p>For any inquiries or feedback, please email us at <a href="mailto:6K2Pn@sa.com">6K2Pn@example.com</a></p>
                    </div>
                </div>
                <div className="card bg-base-200  shadow-amber-500 shadow-md p-4 ">
                    <div className="card-body  flex flex-col items-center">
                        <FaHeadset className="text-5xl mb-4" />
                        <h2 className="card-title">Call Us</h2>
                        <p>You can reach us at +91 (555) 123-4567</p>
                    </div>
                </div>
                <div className="card bg-base-200  shadow-amber-500 shadow-md p-4">
                    <div className="card-body flex flex-col items-center">
                        <FaMapLocation className="text-5xl mb-4" />
                        <h2 className="card-title">Visit Us</h2>
                        <p>Our office is located at 123 Main Street, Anytown, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contactus;   
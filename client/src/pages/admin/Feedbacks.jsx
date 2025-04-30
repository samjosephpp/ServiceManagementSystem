import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllFeedbacks } from '../../services/dataServices';
import ServiceFeedbacks from "../shared/serviceFeedbacks";

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const { user } = useContext(AuthContext);
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

    useEffect(() => {

        const fetchFeedbacks = async () => {
            const feedbacks = await getAllFeedbacks({ userId: null, requestId: null, providerId: null, serviceCategoryId: null, rating: null });
            // console.log("feedbacks", feedbacks);
            setFeedbacks(feedbacks.data.data);
        }
        fetchFeedbacks();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Services Feedbacks</h1>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
                {feedbacks && feedbacks.length > 0 ? (
                    <ServiceFeedbacks feedbacks={feedbacks} />
                ) : (
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">No feedbacks found.</h2>
                    </div>
                )
                }

            </div>

        </div>
    )
};

export default Feedbacks;
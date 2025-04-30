import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllFeedbacks } from '../../services/dataServices';
import ServiceFeedbacks from "../shared/serviceFeedbacks";

const Feedbacks = () => {
    const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({ id: null, name: null, providerId: null });
    const [feedbacks, setFeedbacks] = useState([]);
 
    useEffect(() => {
        if (isLoggedIn && loggedUser) {
            setUserInfo({
                id: loggedUser._id,
                name: loggedUser.name,
                providerId: loggedUser.providerId,
            });
        } else {
            //   setError("User not logged in");
        }
    }, [isLoggedIn, loggedUser]);

    useEffect(() => {
        if (!userInfo.providerId) return;
        // console.log("userInfo", userInfo);

        const fetchFeedbacks = async () => {
            const feedbacks = await getAllFeedbacks({ userId: null, requestId: null, providerId: userInfo.providerId, serviceCategoryId: null, rating: null });
            // console.log("feedbacks", feedbacks);
            setFeedbacks(feedbacks.data.data);
        }
        fetchFeedbacks();
    }, [userInfo.providerId]);

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
import React from "react";

const ServiceFeedbacks = ({ feedbacks }) => {
    return (
        <div>
            {feedbacks.map((feedback) => (
                <div key={feedback._id} className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-medium">
                        <div className="grid grid-cols-1 md:grid-cols-5 sm:grid-cols-1  xs:grid-cols-1  gap-2">
                        <div>Customer: {feedback.userId.name}</div>
                        <div>Provider: {feedback.requestId.providerId.name}</div>
                        <div>Service: {feedback.requestId.providerServiceId.serviceCategoryId.name}</div>
                        <div>Date: {feedback.createdAt}</div>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="rating"
                                        className="mask mask-star bg-yellow-400"
                                        aria-label={`${star} star`}
                                        checked={feedback.rating === star}
                                        readOnly
                                    />
                                ))}
                            </div>
                            
                           

                        </div>
                    </div>
                    <div className="collapse-content text-sm">Comments: {feedback.comment}</div>
                </div>

            ))}
        </div>
    )
};

export default ServiceFeedbacks;
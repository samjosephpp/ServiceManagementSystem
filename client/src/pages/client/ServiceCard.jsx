import React from "react";
import { FaMapMarkerAlt, FaCalendarDay, FaClock, FaMobileAlt, FaMailBulk } from "react-icons/fa";


function ServiceCard({ service, requestService, isLoggedIn }) {

    // console.log(isLoggedIn)

    return (
        <div className="card card-side bg-base-100 shadow-sm  hover:shadow-xl transform hover:scale-101 transition-transform duration-500 ease-in-out">
            <figure style={{ borderRight: "solid 1px #e4e3e3" }}>
                <img className="rounded-lg w-full h-30 "
                    src={service.image || "../src/assets/default-services-icon-01.png"}
                    alt="Service" />
            </figure>
            <div className="card-body">
                <h2 className="card-title  uppercase"> {service.serviceCategoryId.name}</h2>
                <div>{service.providerId.name}</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FaMailBulk className="inline-block mr-1 " />
                        <span className="text-xs uppercase font-semibold opacity-60"> {service.providerId.email}</span>
                    </div>
                    <div className="flex items-center"> <FaMobileAlt className="inline-block mr-1 " />
                        <span className="text-xs uppercase font-semibold opacity-60">{service.providerId.phone}</span>
                    </div>

                </div>
                <div> <FaMapMarkerAlt className="inline-block mr-1 text-red-500" /> {service.locationId.stateId.name} - {service.locationId.name}</div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="badge badge-soft badge-neutral">Availability</span>
                    </div>
                    <div className="flex items-center">
                        <FaCalendarDay className="inline-block mr-1 text-indigo-500" />
                        {service.availabilityDays === "Both" ? "Weekend & WeekDays" : service.availabilityDays}
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-200 py-2 divide-x divide-gray-200">
                        <div> <FaClock className="inline-block mr-1" />  {service.availabilityHours}  </div>
                        <div>{service.availabilityTime}</div>
                        <div>{service.availabiltyFor}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="text-xs uppercase font-semibold">Price <span className="text-lg font-semibold"> ${service.rate}</span> </div>
                    </div>
                    <div className="flex items-center">                        
                        <button className="btn btn-primary btn-sm" id="btnRequest" name="btnRequest"
                            disabled={!isLoggedIn} 
                            onClick={() => requestService(service)}
                            //onClick={requestService} 
                            >
                            {isLoggedIn ? "Request Now" : "Login to Request"}
                        </button>
                    </div>

                    {/* <div className="flex items-center"> <div className="text-xs uppercase font-semibold opacity-60">Rating</div>
                        <div className="flex items-center"> <span className="text-lg font-semibold">{service.rating}</span>
                        </div>
                    </div> */}
                </div>
                {/* <p className="list-col-wrap text-xs"> {service.description} </p> */}


                {/* <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Request Now</button>
                </div> */}
            </div>
        </div>


    );
}

export default ServiceCard;
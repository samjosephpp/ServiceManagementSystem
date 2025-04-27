import React, { use, useContext, useEffect, useState } from "react";
import { getAllActiveServiceCategories, getAvailableServices, getAllLocationsWithState } from "../../services/dataServices";
import { AuthContext } from '../../context/AuthContext';
import ServiceCard from "./ServiceCard";

import { toast } from 'react-toastify';
import {  Link, useNavigate } from 'react-router-dom';

const Services = () => {

    const [services, setServices] = useState([]);
    const [serviceCategories, setServiceCategories] = useState([]);

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);

    const { isLoggedIn, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const requestService = (service) => {
        if(!isLoggedIn) {
                console.log('Login to request')
                toast.error('Login to request');
        }
        else{  
            setSelectedService(service);  
            navigate('/request-service', { state: { service } }); // Navigate to RequestService.jsx with service as state
              
        }
       
    }

    const handleFilter = async () => {
        setLoading(true); // Start loading spinner
        setError(null); // Clear any previous errors

        try {
            const filterresponse = await getAvailableServices(selectedServiceCategory, selectedLocation);

            if (filterresponse.success) {
                setServices(filterresponse.data.data);
            } else {
                setError(filterresponse.message);
            }
        } catch (error) {            
            setError("An error occurred while fetching services.");
        } finally {
            setLoading(false); // Stop loading spinner
        }
 
    }


    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            const response = await getAvailableServices();

            if (response.success) {

                setServices(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };

        const fetchServiceCategories = async () => {
            setLoading(true);
            const response = await getAllActiveServiceCategories();
            if (response.success) {
                // const sc = ['All', ...new Set(response.data.data.map(category => { category._id, category.name }))];
                const sc = response.data.data;
                setServiceCategories(sc);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };

        const fetchLocations = async () => {
            setLoading(true);
            const response = await getAllLocationsWithState();
            // console.log(response);
            if (response.success) {
                // const slocations = ['All', ...new Set(response.data.data.map(location => { location._id, location.mergedName }))];
                setLocations(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }

        fetchServices();
        fetchServiceCategories();
        fetchLocations();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [selectedServiceCategory, selectedLocation]);


    if (loading) {
        return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    // if (services.length === 0) {
    //     return (
    //         <div role="alert" className="alert">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    //             </svg>
    //             <span>No services found</span>
    //         </div>
    //     )
    // }


    return (
        <>
            <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-2 rounded-box">
                <legend className="fieldset-legend">Filter</legend>
                <div className="form-control  flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <select defaultValue={selectedLocation || ""} className="select w-full" id="LocationsWithState" onChange={(e) => setSelectedLocation(e.target.value)} >
                            <option value="" >Select Your location</option>
                            {locations.map((location) => (
                                <option key={location._id} value={location._id} >{location.mergedName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select defaultValue={selectedServiceCategory || ""} className="select w-full" id="ServiceCategories" onChange={(e) => setSelectedServiceCategory(e.target.value)}>
                            <option value="" >Select Your Service</option>
                            {serviceCategories.map((serviceCategory) => (
                                <option key={serviceCategory._id} value={serviceCategory._id} >{serviceCategory.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="flex-1">
                        <button className="btn btn-warning btn-md w-full md:w-auto" onClick={handleFilter} >Apply</button>
                    </div> */}
                </div>

            </fieldset>

            <h4 className="p-4">Showing {services.length} results</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.length > 0 ? (
                    services.map((service) => (
                        <ServiceCard key={service._id} service={service} requestService={requestService} isLoggedIn= {isLoggedIn}/>
                    ))
                ) : (<span></span>)
                }
            </div>
            {services.length === 0 &&
                <div role="alert" className="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>No services found</span>
                </div>
            }
        </>
    )
}
export default Services;
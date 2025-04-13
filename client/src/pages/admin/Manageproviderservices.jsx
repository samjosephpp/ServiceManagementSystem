import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllProviders, getAllProviderServices, getAllLocationsWithState, getAllServiceCategories, createProviderService, updateProviderService } from "../../services/dataServices";
import { FaCircleCheck, FaCertificate, FaRegTrashCan, FaFilePen } from "react-icons/fa6";

import { toast } from 'react-toastify';

const Manageproviderservices = () => {

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedProviderServices, setselectedProviderServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

  const [locations, setLocations] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);

  const [formData, setFormData] = useState({
    providerId: selectedProvider ? selectedProvider._id : "",
    serviceCategoryId: selectedService ? selectedService.serviceCategoryId._id : "",
    availabilityDays: selectedService ? selectedService.availabilityDays : "",
    availabilityHours: selectedService ? selectedService.availabilityHours : "",
    availabilityTime: selectedService ? selectedService.availabilityTime : "",
    availabiltyFor: selectedService ? selectedService.availabiltyFor : "",
    locationId: selectedService ? selectedService.locationId._id : "",
    isActive: selectedService ? selectedService.isActive : true,
    isApproved: selectedService ? selectedService.isApproved : true,
    rate: selectedService ? selectedService.rate : "",
    _id: selectedService ? selectedService._id : ""
  })

  useEffect(() => {
    if (selectedProvider && selectedService) {
      setFormData({
        providerId: selectedProvider._id,
        serviceCategoryId: selectedService.serviceCategoryId._id,
        availabilityDays: selectedService.availabilityDays,
        availabilityHours: selectedService.availabilityHours,
        availabilityTime: selectedService.availabilityTime,
        availabiltyFor: selectedService.availabiltyFor,
        locationId: selectedService.locationId._id,
        isActive: selectedService.isActive,
        isApproved: selectedService.isApproved,
        rate: selectedService.rate,
        _id: selectedService._id
      });
      // console.log("Selected Service updated:", selectedService);
    } else {
      setFormData({
        // providerId: "",
        serviceCategoryId: "",
        availabilityDays: "",
        availabilityHours: "",
        availabilityTime: "",
        availabiltyFor: "",
        locationId: "",
        isActive: true,
        isApproved: true,
        rate: "",
        _id: ""
      });
    }

  }, [selectedProvider, selectedService]);

  useEffect(() => {   

    const fetchProviders = async () => {
      setLoading(true);
      const response = await getAllProviders();
      if (response.success) {
        setProviders(response.data.data);
      } else {
        setError('Failed to fetch providers');
      }
      setLoading(false);
    };

    const fetchLocations = async () => {
      setLoading(true);
      const response = await getAllLocationsWithState();
      if (response.success) {
        setLocations(response.data.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    }

    const fetchServiceCategories = async () => {
      setLoading(true);
      const response = await getAllServiceCategories();
      if (response.success) {
        setServiceCategories(response.data.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    }

    fetchProviders();
    fetchLocations();
    fetchServiceCategories();

  }, []);

  const handleselectedProvider = async (e) => {
    let p_id = e.target.value;
    if (p_id === '' || p_id === ' ' || p_id === null) return;
    clearData();
    const provider = providers.find((p) => p._id === e.target.value);
    setSelectedProvider(provider);
    //capture all services for this provider
    const providerServices = await getAllProviderServices(provider._id);
    // console.log("providerServices ", providerServices);
    if (providerServices.success) {
      const services = providerServices.data.data;
      setselectedProviderServices(services);
      // console.log("providerServices.data.data", services);
    }
    else {
      setselectedProviderServices([]);
    }
  };

  const handleAddService = () => {
    // console.log("Add Serivce clicked");
    formData.providerId = selectedProvider ? selectedProvider._id : "";
    setIsEditing(false)
    setShowModal(true);
  }

  const handleSubmit = async (e) => {
    // console.log("Submit Serivce clicked");
    e.preventDefault();
    if (!formData.serviceCategoryId || !formData.availabilityDays || !formData.availabilityHours || !formData.availabilityTime || !formData.availabiltyFor || !formData.locationId || !formData.rate) {
      toast.error("Please fill in all fields.");
      return;
    }

    // console.log(formData.providerId);

    if(!formData.providerId) {
      formData.providerId = selectedProvider ? selectedProvider._id : "";      
      return;
    }
    if (!formData.isApproved) {
      formData.isApproved = false;
    }
    if (!formData.isActive) {
      formData.isActive = false;
    }

    if (isEditing) {
      const response = await updateProviderService(formData);
      if (response.success) {
        toast.success("Service updated successfully!");
        setselectedProviderServices((prevServices) => prevServices.map((service) => service._id === formData._id ? response.data.data  : service));
        // setselectedProviderServices((prevServices) => prevServices.map((service) => service._id === formData._id ? response.data.data : service));
        clearForm();
        setShowModal(false);
        
        
      } else {
        toast.error(response.message || "An error occured");
      }
    } else {
      const response = await createProviderService(formData);
      if (response.success) {
        toast.success("Service added successfully!");
        clearForm();
        setShowModal(false);
        // setselectedProviderServices((prevServices) => [...prevServices, response.data.data]);
        setselectedProviderServices([...selectedProviderServices, response.data.data]);
      } else {
        toast.error(response.message || "An error occured");
      }
    }


  }

  function handleEditService(service) {
    // console.log("Edit Serivce clicked 0", service);
    if (!service) {
      toast.error('Failed to fetch service');
      return
    };    
    setSelectedService(service);
    setFormData({
      providerId: selectedProvider ? selectedProvider._id : "",
      serviceCategoryId: service.serviceCategoryId._id,
      availabilityDays: service.availabilityDays,
      availabilityHours: service.availabilityHours,
      availabilityTime: service.availabilityTime,
      availabiltyFor: service.availabiltyFor,
      locationId: service.locationId._id,
      isActive: service.isActive,
      isApproved: service.isApproved,
      rate: service.rate,
      _id: service._id,
    });
  
 
    // console.log("selectedService", selectedService);  
    // let s = selectedProviderServices.find((s) => s._id === service._id);
    // console.log("Edit Serivce clicked 1", s);  
    setIsEditing(true);
    setShowModal(true);
  }

  function handleDeleteService(service) {
    // console.log("Delete Serivce clicked");
    if (!service) {
      toast.error('Failed to fetch service');
      return
    };
    const confirmDelete = window.confirm(`Are you sure you want to delete the provider "${provider.name}"?`);
    if (!confirmDelete) {
      return;
    }
    toast.warning("Service deleted successfully!");
    clearForm();
    setShowModal(false);
    setselectedProviderServices((prevServices) => prevServices.filter((s) => s._id !== service._id));
  }

  const resetButton = () => {
    // console.log("Reset button clicked");    
    clearForm();
    setShowModal(true);
  }

  function closeModal() {
    clearForm();
    setShowModal(false);    
  }

  const clearData = () => {
    setSelectedProvider(null);
    setselectedProviderServices([]);
    setSelectedService(null);
    setFormData({});
    setIsEditing(false);
  }

  const clearForm = () => {
    setIsEditing(false);
    setSelectedService(null);
    setFormData({
      providerId: selectedProvider ? selectedProvider._id : "",
      serviceCategoryId: "",
      availabilityDays: "",
      availabilityHours: "",
      availabilityTime: "",
      availabiltyFor: "",
      locationId: "",
      isActive: true,
      isApproved: true,
      rate: "",
      _id: ""
    });
    setError('');
  } 

  if (loading) {
    return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Manage Provider Services</h1>
      <fieldset className="fieldset w-full bg-base-300 border border-base-300 p-5">
        <div className="form-control flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="labe mr-2">
              <span className="label-text">Select Provider:</span>
            </label>
            <select className="select select-bordered w-full max-w-xs focus:outline-none"
              onChange={handleselectedProvider} defaultValue=" " >
              <option disabled value=" ">Filter by...</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id} >{provider.name}</option>
              ))
              }
            </select>
          </div>
        </div>
      </fieldset>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
        <div className="flex items-center justify-between">
          {selectedProvider && (
            <h3 className="text-md font-bold">
              Showing {selectedProviderServices.length} results for {selectedProvider.name}
            </h3>
          )}
          {selectedProvider && selectedProvider._id && (
            <button className="btn btn-primary btn-sm ml-auto" id="addService" name="addService" onClick={handleAddService}   >   Add Service  </button>
          )}
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Service</th>
              <th>Location</th>
              <th>Availability</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedProviderServices && selectedProviderServices.length > 0 ? (
              selectedProviderServices.map((service) => (
                <tr key={service._id}>
                  <td>{service.providerId.name}</td>
                  <td>{service.serviceCategoryId.name}</td>
                  <td> {service.locationId.stateId.name} - {service.locationId.name}</td>
                  <td>
                    <div className="grid grid-flow-row auto-rows-max">
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-xs font-semibold">Days</div>
                          <div className="text-xs">: {service.availabilityDays}</div>
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-xs font-semibold">Hours</div>
                          <div className="text-xs">: {service.availabilityHours}</div>
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-xs font-semibold">Time</div>
                          <div className="text-xs">: {service.availabilityTime}</div>
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-xs font-semibold">Available For</div>
                          <div className="text-xs">: {service.availabiltyFor}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>$ {service.rate}</td>
                  <td>
                    <FaCircleCheck className="text-xl inline-flex " style={{ color: service.isActive ? "green" : "red" }} />
                    <FaCertificate className="text-xl  inline-flex" style={{ color: service.isApproved ? "green" : "red" }} />
                  </td>
                  <td>
                    <button className="btn btn-primary btn-xs mr-2" onClick={() => handleEditService(service)} >  <FaFilePen></FaFilePen>  </button>
                    <button className="btn btn-error btn-xs" onClick={() => handleDeleteService(service)} ><FaRegTrashCan></FaRegTrashCan></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No services found</td>
              </tr>
            )

            }

          </tbody>
        </table>
      </div>
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-4xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="font-bold text-2xl text-gray-800 text-center w-full md:w-auto mb-2 md:mb-0">
                Provider Service
              </h3>
              <p className="text-gray-600 text-sm text-center w-full md:w-auto">
                {/* <strong>Code: &nbsp;</strong> */}
                <label className="inline-block text-gray-700 font-bold mb-2 uppercase">{selectedProvider.name} </label>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2 " id="gridForm">
                <div className="justify-center items-center ">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="serviceCategoryId">  Service </label>
                  <select  className="select w-full" id="serviceCategoryId" name="serviceCategoryId"
                    onChange={(e) => setFormData({ ...formData, serviceCategoryId: e.target.value })} required
                    value={formData.serviceCategoryId}
                    >
                    <option value=""  >Select Your service</option>
                    {serviceCategories.map((serviceCategory) => (
                      <option key={serviceCategory._id} value={serviceCategory._id} disabled={!serviceCategory.isActive}  >{serviceCategory.name} - {serviceCategory.isActive ? "Active" : "Inactive"}</option>
                    ))
                    }
                  </select>
                </div>
                <div> <label className="block text-gray-700 font-bold mb-2" htmlFor="locationId">  Location </label>
                  <select value={formData.locationId} className="select w-full" id="locationId" name="locationId"
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })} required
                  >
                    <option value="" >Select Your location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id} disabled={!location.isActive}  >{location.mergedName} </option>
                    ))}
                  </select>

                </div>
                <div className="col-span-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="availabilityDays"> Availble Days </label>
                      <select value={formData.availabilityDays} className="select w-full" id="availabilityDays" name="availabilityDays"
                        onChange={(e) => setFormData({ ...formData, availabilityDays: e.target.value })} required  >
                        <option value=""   >Select Day</option>
                        <option value="Weekdays" >Weekdays</option>
                        <option value="Weekends" >Weekends</option>
                        <option value="Both" >Both</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="availabilityHours"> Availble Hours </label>
                      <select value={formData.availabilityHours} className="select w-full" id="availabilityHours" name="availabilityHours"
                        onChange={(e) => setFormData({ ...formData, availabilityHours: e.target.value })} required >
                        <option value=""   >Select Hour</option>
                        <option value="24 Hours" >24 Hours</option>
                        <option value="Day Time" >Day Time</option>
                        <option value="Night Time" >Night Time</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="availabilityTime"> Availble Time </label>
                      <select value={formData.availabilityTime} className="select w-full" id="availabilityTime" name="availabilityTime"
                        onChange={(e) => setFormData({ ...formData, availabilityTime: e.target.value })} required >
                        <option value=""   >Select Time</option>
                        <option value="08:00 - 17:00" >08:00 - 17:00</option>
                        <option value="00:00 - 23:59" >00:00 - 23:59</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="availabiltyFor"> Availble Duration </label>
                      <select  className="select w-full" id="availabiltyFor" name="availabiltyFor"
                        onChange={(e) => setFormData({ ...formData, availabiltyFor: e.target.value })} 
                        required value={formData.availabiltyFor || ""} >
                        <option value="">Select Duration</option>
                        <option value="15 Min" >15 Min</option>
                        <option value="30 Min" >30 Min</option>
                        <option value="45 Min" >45 Min</option>
                        <option value="1 Hr" >1 Hr</option>
                        <option value="2 Hr" >2 Hr</option>
                        <option value="2 Hr 30 Min" >2 Hr 30 Min</option>
                        <option value="3 Hr" >3 Hr</option>
                        <option value="3 Hr 30 Min" >3 Hr 30 Min</option>
                      </select>
                    </div>
                  </div>

                </div>
                <div>  <label className="block text-gray-700 font-bold mb-2" htmlFor="rate">  Rate </label>
                  <input type="number" className="input focus:outline-none w-full tabular-nums validator" required placeholder="price"
                    name="rate"
                    value={formData.rate || ""}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })} />

                </div>
                <div className="pt-5">
                  <label className="inline-block text-gray-700 font-bold m-4" htmlFor="isActive">
                    <input className="checkbox" type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    &nbsp; Active
                  </label>
                  <label className="inline-block text-gray-700 font-bold m-4" htmlFor="isApproved">
                    <input className="checkbox" type="checkbox" name="isApproved" id="isApproved" checked={formData.isApproved} onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })} />
                    &nbsp; Approved
                  </label>
                </div>
                <div>                
                  <input type="hidden" value={formData._id} name="_id" id="_id" readOnly className="input focus:outline-none w-full " />
                  <input type="hidden" value={selectedProvider._id} name="providerId" id="providerId" className="input focus:outline-none w-full" readOnly />
                </div>
              </div>
              <div className="modal-action mt-3">
                <button type="submit" className="btn btn-success btn-sm ">  Submit </button>
                {!isEditing && (
                  <button
                    type="reset"
                    id="resetButton"
                    className="btn btn-secondary btn-sm"
                    disabled={loading}
                    onClick={resetButton}
                  >
                    Reset
                  </button>
                )}
                <button className="btn btn-default btn-sm" onClick={closeModal}>Close</button>
              </div>
            </form>


          </div>

        </dialog>
      )

      }

    </div>

  );
}

export default Manageproviderservices;
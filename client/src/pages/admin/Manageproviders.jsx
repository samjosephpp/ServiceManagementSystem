import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { getAllProviders, getAllLocationsWithState, createProvider, updateProvider, removeProvider } from "../../services/dataServices";
import { FaCircleCheck, FaCertificate } from "react-icons/fa6";

import { toast } from 'react-toastify';

// import SingleProvider from "./singleProvider";


const Manageproviders = () => {

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

  const [locations, setLocations] = useState([]);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   code: "",
  //   stateId: "",
  //   locationId: "",
  //   isApproved: false,
  //   isActive: false,
  //   phone: "",
  //   email: "",
  //   address: "",
  //   _id: ""
  // });

  const [formData, setFormData] = useState({
    name: selectedProvider ? selectedProvider.name : "",
    code: selectedProvider ? selectedProvider.code : "",
    stateId: selectedProvider ? selectedProvider.stateId._id : "",
    locationId: selectedProvider ? selectedProvider.locationId._id : "",
    isApproved: selectedProvider ? selectedProvider.isApproved : false,
    isActive: selectedProvider ? selectedProvider.isActive : false,
    phone: selectedProvider ? selectedProvider.phone : "",
    email: selectedProvider ? selectedProvider.email : "",
    address: selectedProvider ? selectedProvider.address : "",
    _id: selectedProvider ? selectedProvider._id : ""
  });
  // console.log("selectedProvider", selectedProvider);
  // console.log("formData", formData);

  useEffect(() => {
    if (selectedProvider) {
      setFormData({
        name: selectedProvider.name || "",
        code: selectedProvider.code || "",
        stateId: selectedProvider.stateId._id || "",
        locationId: selectedProvider.locationId._id || "",
        isApproved: selectedProvider.isApproved || false,
        isActive: selectedProvider.isActive || false,
        phone: selectedProvider.phone || "",
        email: selectedProvider.email || "",
        address: selectedProvider.address || "",
        _id: selectedProvider._id || ""
      });
    } else {
      setFormData({
        name: "",
        code: "",
        stateId: "",
        locationId: "",
        isApproved: false,
        isActive: false,
        phone: "",
        email: "",
        address: "",
        _id: ""
      });
    }
    const fetchProviders = async () => {
      setLoading(true);
      const response = await getAllProviders();
      // console.log(response);

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
    fetchProviders();
    fetchLocations();
  }, [selectedProvider]); //

  if (loading) {
    return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  function handleModalview(providerId) {
    const provider = providers.find(provider => provider._id === providerId);
    if (!provider) {
      // setError('Failed to fetch providers');
      toast.error('Failed to fetch providers');
      return;
    }

    setSelectedProvider(provider);
    setFormData(provider)
    // console.log("provider", provider);
    // console.log("selectedProvider", selectedProvider);
    // console.log("formData", formData);

    setIsEditing(true);
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setSelectedProvider(null);
  }
  function handleAddProvider() {
    console.log("Add Provider clicked 2");
    setIsEditing(false)
    setShowModal(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.locationId || !formData.phone || !formData.email || !formData.address) {
      toast.error("Please fill in all fields.");
      return;
    }
    // !formData.isApproved || !formData.isActive ||
    if (!formData.isApproved) {
      formData.isApproved = false;
    }
    if (!formData.isActive) {
      formData.isActive = false;
    }
    if (isEditing) {
      // console.log("Edit Provider clicked");

      const response = await updateProvider(formData);
      if (response.success) {
        toast.success("Provider updated successfully!");
        clearForm();
        setShowModal(false);
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === formData._id ? formData : provider));
      } else {
        toast.error(response.message || "An error occured");
      }
    } else {
      // console.log("Add Provider clicked");     
      const response = await createProvider(formData);
      if (response.success) {
        toast.success("Provider added successfully!");
        clearForm();
        setShowModal(false);
        setProviders([...providers, response.data.data]);
      } else {
        toast.error(response.message || "An error occured");
      }
    }
  }
  const deleteProvider = async (provider) => {
    // console.log("Delete Provider clicked");
    // console.log("provider", provider);
    const confirmDelete = window.confirm(`Are you sure you want to delete the provider "${provider.name}"?`);
    if (!confirmDelete) {
      return;
    }
    const response = await removeProvider(provider._id);
    // console.log("response", response);
    if (response.success) {
      toast.success("Provider deleted successfully!");
      clearForm();
      setShowModal(false);
      setProviders((prevProviders) => prevProviders.filter((p) => p._id !== provider._id));
    } else {
      toast.error(response.message || "An error occured");
    }


  }

  const resetButton = () => {
    // console.log("Reset button clicked");    
    clearForm();
    setShowModal(true);
  }
  const clearForm = () => {
    setIsEditing(false);
    setSelectedProvider(null);
    setFormData({
      name: "",
      code: "",
      stateId: "",
      locationId: "",
      isApproved: false,
      isActive: false,
      phone: "",
      email: "",
      address: "",
      _id: ""
    });
    setError('');
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Manage Providers</h1>
      <h4 className="p-4">Showing {providers.length} results</h4>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-5">
        <table className="table w-full">
          <thead>
            <tr><th colSpan={"5"} className="text-right "> <button className="btn btn-primary btn-sm" id="addProvider" name="addProvider" onClick={handleAddProvider}  >Add</button></th></tr>
            <tr>
              <th>Provider</th>
              <th>Code</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions  </th>
            </tr>
          </thead>

          <tbody>
            {
              providers && providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider._id}>
                    <td>{provider.name}</td>
                    <td>{provider.code}</td>
                    <td>{provider.stateId.name} - {provider.locationId.name}</td>
                    <td>
                      <FaCircleCheck className="text-xl inline-flex " style={{ color: provider.isActive ? "green" : "red" }} />
                      <FaCertificate className="text-xl  inline-flex" style={{ color: provider.isApproved ? "green" : "red" }} />
                      {/* <i className={`fa-solid fa-circle-check`} style={{ color: provider.isActive ? "green" : "red" }}> </i>  */}
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm mr-2" value={provider._id} onClick={() => handleModalview(provider._id)} >Edit</button>
                      <button className="btn btn-error btn-sm" value={provider._id} onClick={() => deleteProvider(provider)} >Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No providers found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="font-bold text-2xl text-gray-800 text-center w-full md:w-auto mb-2 md:mb-0">
                Provider
              </h3>
              <p className="text-gray-600 text-sm text-center w-full md:w-auto">
                <strong>Code: &nbsp;</strong>
                <label className="inline-block text-gray-700 font-bold mb-2 uppercase">{formData.code}</label>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">

              <div className="justify-center items-center ">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">  Name </label>
                <input required
                  type="text"
                  className="input focus:outline-none w-full validator"
                  name="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="validator-hint hidden">Name is required</p>

                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">  Email </label>
                <input
                  type="email"
                  className="input focus:outline-none w-full validator"
                  name="name"
                  disabled={isEditing}
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="validator-hint hidden">Enter valid email address</p>

                <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">  Phone </label>
                <input type="tel" className="input focus:outline-none w-full tabular-nums validator" required placeholder="Phone" pattern="[0-9]*" minLength="10" maxLength="10" title="Must be 10 digits"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <p className="validator-hint hidden">Must be 10 digits</p>

                <label className="block text-gray-700 font-bold mb-2" htmlFor="locationId"> Your  Location </label>
                <select defaultValue={formData.locationId} className="select w-full" id="locationId" name="locationId"

                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                >
                  <option value="" >Select Your location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id} >{location.mergedName}</option>
                  ))}
                </select>

                <label className="block text-gray-700 font-bold mb-2" htmlFor="address">  Address </label>
                <textarea
                  name="address"
                  className="textarea textarea-bordered w-full  focus:outline-none  validator"
                  placeholder="Enter Address"
                  required
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <p className="validator-hint hidden">Address is required</p>

                <label className="inline-block text-gray-700 font-bold m-4" htmlFor="isActive">
                  <input className="checkbox" type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  &nbsp; Active
                </label>
                <label className="inline-block text-gray-700 font-bold m-4" htmlFor="isApproved">
                  <input className="checkbox" type="checkbox" name="isApproved" id="isApproved" checked={formData.isApproved} onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })} />
                  &nbsp; Approved
                </label>
                <input type="hidden" value={formData._id} readOnly />

              </div>

              <div className="modal-action mt-6">

                <button type="submit" className="btn btn-success btn-sm ">  Submit </button>

                {!isEditing && (
                  <button
                    type="button"
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
      )}



    </div>

  );
}

export default Manageproviders;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { FaRegTrashCan, FaFilePen, FaRetweet, FaRegSquarePlus } from "react-icons/fa6";

import { toast } from 'react-toastify';


import { getAllLocationsWithState, getAllStates } from "../../services/dataServices";
// , createLocation, updateLocation, removeLocation

const ManageLocations = () => {
  const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [locations, setLocations] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedState, setSelectedState] = useState({
    _id: "",
    name: "",
    code: "",
    description: "",
    isActive: false
  });
  const [selectedLocation, setSelectedLocation] = useState({
    _id: "",
    name: "",
    code: "",
    stateId: null,
    pincode: "",
    isActive: false
  });
  const [isStateEditing, setIsStateEditing] = useState(false);
  const [isLocationEditing, setIsLocationEditing] = useState(false);

  useEffect(() => {

    const fetchLocations = async () => {  
      setLoading(true);
      const response =  await getAllLocationsWithState(); 
      console.log(response);
      if (response.success) {
        setLocations(response.data.data);
      } else {
        setError('Failed to fetch locations');
      }
      setLoading(false);
    } 
    setLoading(false);
    // fetchStates();
    fetchLocations();
  }, [states]);

  useEffect (() => {
    const fetchStates = async () => {
      const response = await getAllStates();
      if (response.success) {
        setStates(response.data.data);
      } else {
        setError('Failed to fetch states');
      }
    }
    fetchStates();
  }, []);

  const addState = () => {
    setSelectedState({ _id: "", name: "", code: "", description: "", isActive: false });
    setIsStateEditing(false);
    document.getElementById("formStates").reset();
  }
  const updateState = (state) => {
    setSelectedState({ ...state, isActive: !state.isActive });
    setIsStateEditing(true);
  }

  const resetState = () => {
    setSelectedState({ _id: "", name: "", code: "", description: "", isActive: false });
    setIsStateEditing(false);
  }

  const addLocation = () => {
    setSelectedLocation({ _id: "", name: "", code: "", stateId: null, pincode: "", isActive: false });
    setIsLocationEditing(false);
    document.getElementById("formLocations").reset();
  }
  const updateLocation = (location) => {
    setSelectedLocation({ ...location, isActive: !location.isActive });
    setIsLocationEditing(true);
  }
  const removeLocation = (location) => {
    setSelectedLocation({ ...location, isActive: !location.isActive });
    setIsLocationEditing(true);
  }

  const resetLocation = () => {
    setSelectedLocation({ _id: "", name: "", code: "", stateId: null, pincode: "", isActive: false });
    setIsLocationEditing(false);
  }

  if (loading) {
    return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
  }
  if (error) {
    return <p>Error: {error}</p>;
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Manage State / Locations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-0">
          <h6 className="text-xs font-bold uppercase   bg-gray-200 p-2  ">States</h6>
          <form id="formStates" name="formStates" className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-2 p-2">
            <div className="justify-center items-center pt-1 ">
              <label className="text-xs uppercase text-gray-500  font-bold mb-0 " htmlFor="statename">  Name </label>
              <input type="text" className="input focus:outline-none w-full max-w-xs" name="statename" value={selectedState.name || ""}
                onChange={(e) => setSelectedState({ ...selectedState, name: e.target.value })} />
            </div>
            <div className="justify-center items-center pt-1  ">
              <label className="text-xs uppercase text-gray-500  font-bold mb-0 " htmlFor="statedescription">  Description </label>
              <input type="text" className="input focus:outline-none w-full max-w-xs" name="statedescription" value={selectedState.description || ""}
                onChange={(e) => setSelectedState({ ...selectedState, description: e.target.value })} />
            </div>
            <div className="justify-center items-center pt-7  ">
              <button type="button" className="btn btn-primary btn-sm" onClick={isStateEditing ? updateState : addState} disabled={loading}>{isStateEditing ? <FaFilePen /> : <FaRegSquarePlus />}</button>
              <button type="button" className="btn btn-secondary btn-sm " disabled={loading} onClick={resetState}><FaRetweet /></button>
            </div>
          </form>
          <div className="box-content size-80 w-full  overflow-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>  
                  <th>Name</th> 
                  <th>Description</th>  
                  <th>Actions</th>  
                </tr>
              </thead>  
              <tbody>
                {states.map((state) => (
                  <tr key={state._id}>
                    <td>{state.name}</td>
                    <td>{state.description}</td>  
                    <td>
                      <button type="button" className="btn btn-primary btn-xs" onClick={() => updateState(state)} disabled={loading}><FaFilePen /></button>
                      <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => updateState(state)}><FaRegSquarePlus /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg p-0">
          <h6 className="text-xs font-bold uppercase   bg-gray-200 p-2  ">Locations / Area</h6>
          <form id="formLocations" name="formLocations" className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-2 p-2">
            <div className="justify-center items-center pt-1 ">
              <label className="text-xs uppercase text-gray-500  font-bold mb-0 " htmlFor="locationname">Name</label>
              <input type="text" className="input focus:outline-none w-full max-w-xs" name="locationname" value={selectedLocation.name || ""}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, name: e.target.value })} />
            </div>
            <div className="justify-center items-center pt-1  ">
              <label className="text-xs uppercase text-gray-500  font-bold mb-0 " htmlFor="locationState">  State </label>
              <select className="select select-bordered w-full max-w-xs focus:outline-none"
                onChange={(e) => setSelectedLocation({ ...selectedLocation, stateId: e.target.value })} 
                value={selectedLocation.stateId || ""}
                required
              >
                <option disabled value="">Filter by...</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id} >{state.name}</option>
                ))}
              </select>
            </div>
            <div className="justify-center items-center pt-1   ">
              <label className="text-xs uppercase text-gray-500  font-bold mb-0 " htmlFor="locationpincode">Pincode</label>
              <input type="text" className="input focus:outline-none w-full max-w-xs" name="locationpincode" value={selectedLocation.pincode || ""}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, pincode: e.target.value })} />
            </div>
            <div className="justify-center items-center pt-7 ">
              <button type="button" className="btn btn-primary btn-sm" onClick={isLocationEditing ? updateLocation : addLocation} disabled={loading}>{isLocationEditing ? <FaFilePen /> : <FaRegSquarePlus />}</button>
              <button type="button" className="btn btn-secondary btn-sm " disabled={loading} onClick={resetLocation}><FaRetweet /></button>
            </div>
          </form>
          <div className="box-content size-80 w-full overflow-auto">  
          <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Actions</th>  
                </tr>  
              </thead>    
              <tbody>    
                {locations.map((location) => (
                  <tr key={location._id}>
                    <td>{location.name}</td>
                    <td>{location.stateId.name}</td>
                    <td>{location.pincode}</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-xs" onClick={() => updateLocation(location)} disabled={loading}><FaFilePen /></button>
                      {/* <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => updateLocation(location)}>< FaRegSquarePlus  /></button> */}
                      <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => removeLocation(location)}><FaRegTrashCan /></button>
                    </td>
                  </tr>
                ))}
              </tbody> 
            </table>
                      
          </div>
        </div>


      </div>

    </div>
  );
}

export default ManageLocations;

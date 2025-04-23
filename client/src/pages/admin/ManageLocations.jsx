import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { FaRegTrashCan, FaFilePen, FaRetweet, FaRegSquarePlus } from "react-icons/fa6";

import { toast } from 'react-toastify';


import { getAllLocationsWithState, getAllStates, addNewState, updateState, updateStateStatus, removeState } from "../../services/dataServices";
// , createLocation, updateLocation, removeLocation
import { getAllLocations, addNewLocation, updateLocation, updateLocationStatus, removeLocation } from "../../services/dataServices";

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
      const response = await getAllLocations();  //getAllLocationsWithState();
      // console.log("locations",response);
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
  }, []);

  useEffect(() => {
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

  const addState = async () => {
    // setSelectedState({ _id: "", name: "", code: "", description: "", isActive: false });
    // console.log("selectedState", selectedState);
    if (!selectedState.name || !selectedState.description) {
      toast.error("State Name and description is required");
      return;
    }
    const response = await addNewState(selectedState);
    if (response.success) {
      toast.success(response.message);
      setStates([...states, response.data.data]);
    } else {
      // toast.error("Failed to add state");
      toast.error(response.message);
    }
    setIsStateEditing(false);
    document.getElementById("formStates").reset();
  }

  const updateStateHandler = (state) => {
    // setSelectedState({ ...state, isActive: !state.isActive });
    setSelectedState({ ...state });
    setIsStateEditing(true);
  }

  const removeStateHandler = async (state) => {
    const confirmStatusChange = window.confirm(`Are you sure you want to remove the state "${state.name}"?`);
    if (!confirmStatusChange) {
      return;
    }
    const response = await removeState(state._id);
    if (response.success) {
      toast.success("State removed successfully");
      setStates((prevStates) => prevStates.filter((s) => s._id !== state._id));

    } else {
      toast.error("Failed to remove state. " + response.message);

    }
  }

  const editState = async () => {
    // console.log("selectedState", selectedState);
    const response = await updateState(selectedState._id, selectedState);
    if (response.success) {
      toast.success("State updated successfully");
      states.map((state) => {
        if (state._id === selectedState._id) {
          state.name = selectedState.name;
          state.code = selectedState.code;
          state.description = selectedState.description;
          state.isActive = selectedState.isActive;
        }
      });
      setStates([...states]);
      setIsStateEditing(false);
      resetState();
      document.getElementById("formStates").reset();
    } else {
      // toast.error("Failed to update state");
      toast.error(response.message);
    }
   
  }

  const handleStateStatusChange = async (stateId, isActive, state) => {
    const confirmStatusChange = window.confirm(`Are you sure you want to change the status of "${state.name}"?`);
    if (!confirmStatusChange) {
      return;
    }
    const response = await updateStateStatus(stateId, { isActive: isActive });
    if (response.success) {
      toast.success("State updated successfully");
      states.map((state) => {
        if (state._id === stateId) {
          state.isActive = isActive;
        }
      });
      setStates([...states]);
    } else {
      toast.error(response.message);
      toast.error("Failed to update state");
    }
  }

  const resetState = () => {
    setSelectedState({ _id: "", name: "", code: "", description: "", isActive: false });
    setIsStateEditing(false);
  }

  const addLocation = async () => {
    // setSelectedLocation({ _id: "", name: "", code: "", stateId: null, pincode: "", isActive: false });

    if (!selectedLocation.name || !selectedLocation.pincode || !selectedLocation.stateId) {
      toast.error("Location Name, pincode and State is required");
      return;
    }
    const response = await addNewLocation(selectedLocation);
    if (response.success) {
      toast.success("Location added successfully");
      setLocations([...locations, response.data.data]);
    } else {
      toast.error("Failed to add location");
      toast.error(response.message);
    }

    setIsLocationEditing(false); 
    document.getElementById("formLocations").reset();
  }
  const updateLocationHandler = (location) => {
    setSelectedLocation({ ...location });
    setIsLocationEditing(true);
  }
  const handleLocationStatusChange = async (locationId, isActive, location) => {
    const confirmStatusChange = window.confirm(`Are you sure you want to change the status of "${location.name}"?`);
    if (!confirmStatusChange) {
      return;
    }
    const response = await updateLocationStatus(locationId, { isActive: isActive });
    if (response.success) {
      toast.success("Location updated successfully");
      locations.map((location) => {
        if (location._id === locationId) {
          location.isActive = isActive;
        }
      });
      setLocations([...locations]);
    } else {
      toast.error("Failed to update location");
    }
  }

  const editLocation = async () => {
    // console.log("selectedLocation", selectedLocation);
    if (!selectedLocation.name || !selectedLocation.pincode || !selectedLocation.stateId) {
      toast.error("Location Name, pincode and State is required");
      return;
    }
    const response = await updateLocation(selectedLocation._id, selectedLocation);
    // console.log("response", response);
    if (response.success) {
      toast.success("Location updated successfully");
      locations.map((location) => {
        if (location._id === selectedLocation._id) {
          // location.name = selectedLocation.name;
          // location.code = selectedLocation.code;
          // location.stateId = selectedLocation.stateId;
          // location.pincode = selectedLocation.pincode;
          // location.isActive = selectedLocation.isActive;
          location.name = response.data.data.name;
          location.code = response.data.data.code;
          location.stateId = response.data.data.stateId;
          location.pincode = response.data.data.pincode;
          location.isActive = response.data.data.isActive;
        }
      });
      setLocations([...locations]);

      setIsLocationEditing(false);
      resetLocation();
    } else {
      // toast.error("Failed to update location");
      toast.error(response.message);
    }
    // document.getElementById("formLocations").reset();
  }

  const removeLocationHandler = async (location) => {
    const confirmStatusChange = window.confirm(`Are you sure you want to remove the location "${location.name}"?`);
    if (!confirmStatusChange) {
      return;
    }
    const response = await removeLocation(location._id);
    if (response.success) {
      toast.success("Location removed successfully");
      setLocations((prevLocations) => prevLocations.filter((l) => l._id !== location._id));
    } else {
      toast.error("Failed to remove location. " + response.message);
    }
  }

  const resetLocation = () => {
    setSelectedLocation({ _id: "", name: "", code: "", stateId: null, pincode: "", isActive: false });
    document.getElementById("formLocations").reset();
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
              <button type="button" className="btn btn-primary btn-sm" onClick={isStateEditing ? editState : addState} disabled={loading}>{isStateEditing ? <FaFilePen /> : <FaRegSquarePlus />}</button>
              <button type="button" className="btn btn-secondary btn-sm " disabled={loading} onClick={resetState}><FaRetweet /></button>
            </div>
          </form>
          <div className="box-content size-80 w-full  overflow-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {states.map((state) => (
                  <tr key={state._id}>
                    <td>{state.name}</td>
                    <td>{state.description}</td>
                    <td>
                      <input className="checkbox" type="checkbox" name="isActive" id="isActive" checked={state.isActive}
                        onChange={(e) => { handleStateStatusChange(state._id, e.target.checked, state); }} />
                    </td>
                    <td>
                      <button type="button" className="btn btn-primary btn-xs" onClick={() => updateStateHandler(state)} disabled={loading}><FaFilePen /></button>
                      <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => removeStateHandler(state)}><FaRegTrashCan /></button>
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
              <select className="select select-bordered w-full max-w-xs focus:outline-none" name="locationState" id="locationState"
                onChange={(e) => setSelectedLocation({ ...selectedLocation, stateId: e.target.value })}
                defaultValue={selectedLocation.stateId || ""}
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
              <button type="button" className="btn btn-primary btn-sm" onClick={isLocationEditing ? editLocation : addLocation} disabled={loading}>{isLocationEditing ? <FaFilePen /> : <FaRegSquarePlus />}</button>
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
                  <th>Active</th>
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
                      <input className="checkbox" type="checkbox" name="isActive" id="isActive" checked={location.isActive}
                        onChange={(e) => { handleLocationStatusChange(location._id, e.target.checked, location); }} />
                    </td>
                    <td>
                      <button type="button" className="btn btn-primary btn-xs" onClick={() => updateLocationHandler(location)} disabled={loading}><FaFilePen /></button>
                      {/* <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => updateLocation(location)}>< FaRegSquarePlus  /></button> */}
                      <button type="button" className="btn btn-secondary btn-xs " disabled={loading} onClick={() => removeLocationHandler(location)}><FaRegTrashCan /></button>
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

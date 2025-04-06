import React, { useEffect, useState, useContext } from "react";
import { getAllLocationsWithState } from "../../services/dataServices";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";
import { getLoggedInRole } from "../../services/utilService";


const Signup = () => {

  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    locationId: "",
    stateId: "",
    phone: "",
    address: ""
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getAllLocationsWithState();
        if (response.success) {
          // console.log(response.data.data);
          setLocations(response.data.data);
        } else {
          setError(response.message);
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("An error occurred while fetching locations.");
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    setError('');
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.locationId || !formData.address || !formData.phone) {
        toast.error("Please fill in all fields.");
        setError("Please fill in all fields.")
        return;
      }
      const response = await registerUser(formData);
      // console.log(response);
      if (response.success) {
        toast.success("Signup successful!");
        navigate('/login');
      } else {
        toast.error(response.message || "An error occured");
        setError(response.message || "An error occured")
      }

    } catch (error) {
      toast.error("An error occurred during signup.");
      setError('An error occurred during signup.');
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Signup now!</h1>
            <p className="py-6">
              Create an account to access exclusive features and content. Join us today!
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="fieldset-label">Name</label>
                <input type="text" className="input" placeholder="Name" name="name" value={formData.name}
                  onChange={handleInputChange} />
                <label className="fieldset-label">Email</label>
                <input type="email" className="input" placeholder="Email" name="email" value={formData.email}
                  onChange={handleInputChange} />
                <label className="fieldset-label">Password</label>
                <input type="password" className="input" placeholder="Password" name="password" value={formData.password}
                  onChange={handleInputChange} />
                <label className="fieldset-label">Location</label>
                <select className="select " id="LocationsWithState" name="locationId"
                  value={formData.locationId}
                  onChange={handleInputChange} >
                  <option value="" >Select Your location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id} >{location.mergedName}</option>
                  ))}
                </select>
                <label className="fieldset-label">Role</label>
                <select className="select " id="role" name="role" value={formData.role}
                  onChange={handleInputChange} >
                  <option value="" >Select Your Role</option>
                  <option value="Client">Client</option>
                  <option value="ServiceProvider">ServiceProvider</option>
                </select>
                <label className="fieldset-label">Address</label>
                <input type="text" className="input" placeholder="Address" name="address" value={formData.address}
                  onChange={handleInputChange} />
                <label className="fieldset-label">Contact</label>
                <input type="text" className="input" placeholder="Contact" name="phone" value={formData.phone}
                  onChange={handleInputChange} />
                {/* <div><a className="link link-hover">Forgot password?</a></div> */}
                <button className="btn btn-neutral mt-4">Signup</button>
                {error && <div className="alert alert-error shadow-lg mt-4">
                  <div>
                    <span>{error}</span>
                  </div>
                </div>}
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Signup;
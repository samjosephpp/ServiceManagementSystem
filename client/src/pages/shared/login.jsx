import React, { useEffect , useContext, useState } from "react";
import {  Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService'
import { getLoggedInRole } from '../../services/utilService'
import { AuthContext } from "../../context/AuthContext";

import { toast } from 'react-toastify';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser({email, password});
        // console.log("response", response);
      if(response.success){
            const role = getLoggedInRole(response.token);
            // console.log(`Decoded role in login: ${role}`)           
            login( response.token,  response.refreshToken, role, response.data);
            toast.success('Login successfully')
            if(role.toLowerCase() === "client")
            {navigate('/');}
            else{
              navigate(`/${role.toLowerCase()}`)
            }
      }
      else{
        setError(response.message || "An error occured")
        // toast.error(response.message || 'An error occurred');
      }     
    } catch (error) {   
      setError(error || 'Invalid email or password');
      // toast.error('Invalid email or password');
    }
  } 
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">

          </p>
        </div>
        
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="fieldset-label">Email</label>
              <input type="email" className="input" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <label className="fieldset-label">Password</label>
              <input type="password" className="input" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <div><a className="link link-hover">Forgot password?</a></div>
              <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
          </div>
          
          <div className="card-actions justify-end mt-4">
            {/* <button className="btn btn-link">Don't have an account?</button>
            <button className="btn btn-link">Sign Up</button> */}
            {/* <p className="btn btn-link" style={ "text-decoration: none;"} >Don't have an account?<Link to={"/signup"}  className="link link-hover">Sign Up</Link> </p> */}
             <span className="text-sm text-primary pr-5 pb-5 font-medium" >Don't have an account? <Link to={"/signup"}  className="link link-hover">Sign Up</Link> </span>
          </div>
          {error && <div className="alert alert-error shadow-lg mt-4">
            <div>
              <span>{error}</span>
            </div>
          </div>}
        </div>
       
       
      </div>
    </div>
    </form>

  )
}
export default Login;
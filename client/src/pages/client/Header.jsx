import React from "react";
import DarkMode from "../../components/shared/DarkMode";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate =  useNavigate();
    return (
        // <div className="bg-red text-white p-3">Client Header</div>
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>                       
                    </div>
                    <a className="btn btn-ghost text-xl"><img src="../src/assets/logo-dark-1.png" alt="logo" /></a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li onClick={()=>navigate("/")}><a>Home</a></li>
                        <li onClick={()=>navigate("/about")}><a>About</a></li>
                        <li onClick={()=>navigate("/services")}><a>Services</a></li>                         
                    </ul>
                </div>
                
                <div className="navbar-end gap-4">
                <DarkMode />
                    <a className="btn btn-warning"><b>LOGIN</b></a>
                    <a className="btn btn-warning"><b>SIGNUP</b></a>
                </div>
            </div>
            {/* <div className="navbar bg-neutral text-neutral-content">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>

            <div className="navbar bg-base-300">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>

            <div className="navbar bg-primary text-primary-content">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div> */}
        </>
    )
}

export default Header;
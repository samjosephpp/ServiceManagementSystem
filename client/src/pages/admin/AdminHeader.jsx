import React, { useContext, useState } from "react";
import DarkMode from "../../components/shared/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const adminnavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', current: true },
    { name: 'Users', href: '/admin/users', current: false },
    { name: 'Locations', href: '/admin/locations', current: false },
    { name: 'Providers', href: '/admin/manageproviders', current: false },
    { name: 'Services', href: '/admin/providerservices', current: false },
    { name: 'ServiceRequests', href: '/admin/serviceRequests', current: false },
    { name: 'Feedbacks', href: '/admin/feedbacks', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const AdminHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, userRole, logout } = useContext(AuthContext)

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log("Menu Open:", !isMenuOpen); // Debugging
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close the menu
    };

    return (
        <div className="navbar bg-base-100 shadow-sm relative">
               <div className="navbar-start">
                {/* Hamburger menu for smaller screens */}
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost lg:hidden"
                    onClick={toggleMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16"
                        />
                    </svg>
                </div>
                <a className="btn btn-ghost text-xl">
                    {/* <img src="../src/assets/logo-dark-1.png" alt="logo" /> */}
                    <img src="/images/logo-dark-1.png" alt="logo" />
                </a>
            </div>

            {/* Menu items */}
            <div
                className={`absolute top-full left-0 w-full bg-base-100 shadow-md z-10 lg:static lg:bg-transparent lg:shadow-none ${isMenuOpen ? "block" : "hidden"
                    } lg:flex`}
            >
                <ul className="menu menu-horizontal lg:flex lg:space-x-4 p-2 lg:p-0">
                    {
                        adminnavigation.map((item) => (
                            // <li key={item.name} className={classNames(item.current ? 'text-primary' : '', 'hover:text-primary')} onClick={() => handleMenuItemClick(item.href)}>
                            //     <a>{item.name}</a>
                            // </li>
                            <li  key={item.name}  onClick={() => handleMenuItemClick(item.href)}>
                                 <a>{item.name}</a>
                            </li>
                        ))
                    }                  
                </ul>

                {/* LOGIN and SIGNUP buttons for smaller screens */}
                {isMenuOpen && (
                    <div className="flex flex-col items-center space-y-2 mt-2 lg:hidden">
                        <a
                            className="btn btn-warning btn-sm"
                            onClick={() => handleMenuItemClick("/login")}
                        >
                            <b>LOGIN</b>
                        </a>
                    </div>
                )}
            </div>
            {/* Dark Mode Toggle and Login/Signup Buttons for larger screens */}
            <div className="navbar-end hidden lg:flex items-center gap-4">
                <DarkMode />
                {!isLoggedIn ? (<>
                    <a className="btn btn-warning btn-md" onClick={() => navigate("/login")}>
                        <b>LOGIN</b>
                    </a>
                </>
                ) : (<>
                    <Link className="btn btn-default btn-md" to='/login' onClick={logout} ><b>LOGOUT</b></Link>
                </>)}

            </div>
        </div>
 
    )
}

export default AdminHeader;
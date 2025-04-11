import React, { useContext, useState } from "react";
import DarkMode from "../../components/shared/DarkMode";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, userRole, logout } = useContext(AuthContext)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log("Menu Open:", !isMenuOpen); // Debugging
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close the menu
    };


    const navigate = useNavigate();

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
                    <img src="../src/assets/logo-dark-1.png" alt="logo" />
                </a>
            </div>

            {/* Menu items */}
            <div
                className={`absolute top-full left-0 w-full bg-base-100 shadow-md z-10 lg:static lg:bg-transparent lg:shadow-none ${isMenuOpen ? "block" : "hidden"
                    } lg:flex`}
            >
                <ul className="menu menu-horizontal lg:flex lg:space-x-4 p-2 lg:p-0">
                    <li onClick={() => handleMenuItemClick("/")}>
                        <a>Home</a>
                    </li>
                    {/* <li onClick={() => handleMenuItemClick("/about")}>
                        <a>About</a>
                    </li> */}
                    <li onClick={() => handleMenuItemClick("/services")}>
                        <a>Services</a>
                    </li>
                    <li onClick={() => handleMenuItemClick("/contactus")}>
                        <a>Contact Us</a>
                    </li>
                    {isLoggedIn && (
                        <li onClick={() => handleMenuItemClick("/myrequest")}>
                            <a>My Requests</a>
                        </li>
                    )}
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
                        <a
                            className="btn btn-warning btn-sm"
                            onClick={() => handleMenuItemClick("/signup")}
                        >
                            <b>SIGNUP</b>
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
                    <a className="btn btn-warning btn-md" onClick={() => navigate("/signup")}>
                        <b>SIGNUP</b>
                    </a> </>
                ) : (<>
                    {/* <a className="btn btn-default btn-md" onClick={() => navigate("/login")}>
                            <b>LOGIN</b>
                        </a> */}
                    <Link className="btn btn-default btn-md" to='/login' onClick={logout} ><b>LOGOUT</b></Link>
                </>)}

            </div>
        </div>

    )

    // Working code
    // return (
    //     <div className="navbar bg-base-100 shadow-sm relative">
    //     <div className="navbar-start">
    //         {/* Hamburger menu for smaller screens */}
    //         <div
    //             tabIndex={0}
    //             role="button"
    //             className="btn btn-ghost lg:hidden"
    //             onClick={toggleMenu}
    //         >
    //             <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="h-5 w-5"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //             >
    //                 <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth="2"
    //                     d="M4 6h16M4 12h8m-8 6h16"
    //                 />
    //             </svg>
    //         </div>
    //         <a className="btn btn-ghost text-xl">
    //             <img src="../src/assets/logo-dark-1.png" alt="logo" />
    //         </a>
    //     </div>

    //     {/* Dropdown menu for smaller screens */}
    //     {isMenuOpen && (
    //         <div className="absolute top-full left-0 w-full bg-base-100 shadow-md z-10 lg:hidden">
    //             <ul className="menu menu-compact p-2">
    //                 <li onClick={() => handleMenuItemClick("/")}>
    //                     <a>Home</a>
    //                 </li>
    //                 <li onClick={() => handleMenuItemClick("/about")}>
    //                     <a>About</a>
    //                 </li>
    //                 <li onClick={() => handleMenuItemClick("/services")}>
    //                     <a>Services</a>
    //                 </li>

    //             </ul>
    //               {/* LOGIN and SIGNUP buttons */}
    //               <div className="flex justify-center space-x-4 mt-2">
    //                     <a
    //                         className="btn btn-warning btn-sm"
    //                         onClick={() => setIsMenuOpen(false)}
    //                     >
    //                         <b>LOGIN</b>
    //                     </a>
    //                     <a
    //                         className="btn btn-warning btn-sm"
    //                         onClick={() => setIsMenuOpen(false)}
    //                     >
    //                         <b>SIGNUP</b>
    //                     </a>
    //                 </div>
    //         </div>
    //     )}

    //     {/* Menu items for larger screens */}
    //     <div className="navbar-center hidden lg:flex">
    //         <ul className="menu menu-horizontal p-0">
    //             <li onClick={() => navigate("/")}>
    //                 <a>Home</a>
    //             </li>
    //             <li onClick={() => navigate("/about")}>
    //                 <a>About</a>
    //             </li>
    //             <li onClick={() => navigate("/services")}>
    //                 <a>Services</a>
    //             </li>
    //         </ul>
    //     </div>

    //     {/* Login/Signup buttons for larger screens */}
    //     <div className="navbar-end hidden lg:flex">
    //             <DarkMode />
    //             <div className="flex gap-1">
    //                 <a className="btn btn-warning">
    //                     <b>LOGIN</b>
    //                 </a>
    //                 <a className="btn btn-warning">
    //                     <b>SIGNUP</b>
    //                 </a>
    //             </div>
    //         </div>
    // </div>

    // );

    // return (
    //     // <div className="bg-red text-white p-3">Client Header</div>
    //     <>
    //         <div className="navbar bg-base-100 shadow-sm">
    //             <div className="navbar-start">
    //                 <div className="dropdown" >
    //                     <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden"   onClick={() => console.log("Hamburger Menu Clicked")}  >
    //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
    //                     </div>
    //                 </div>
    //                 <a className="btn btn-ghost text-xl"><img src="../src/assets/logo-dark-1.png" alt="logo" /></a>
    //             </div>

    //             {/* Menu items */}
    //             <div
    //                 className={`navbar-center ${isMenuOpen ? "block" : "hidden"
    //                     } lg:flex`}
    //             >
    //                 <ul className="menu menu-horizontal p-0">
    //                     <li onClick={() => navigate("/")}>
    //                         <a>Home</a>
    //                     </li>
    //                     <li onClick={() => navigate("/about")}>
    //                         <a>About</a>
    //                     </li>
    //                     <li onClick={() => navigate("/services")}>
    //                         <a>Services</a>
    //                     </li>
    //                 </ul>
    //             </div>

    //             {/* Login/Signup buttons */}
    //             <div className="navbar-end gap-4">
    //                 <DarkMode />
    //                 <ul
    //                     className={`menu menu-horizontal p-0 ${isMenuOpen ? "block" : "hidden"
    //                         } lg:flex`}
    //                 >
    //                     <li>
    //                         <a className="btn btn-warning">
    //                             <b>LOGIN</b>
    //                         </a>
    //                     </li>
    //                     <li>
    //                         <a className="btn btn-warning">
    //                             <b>SIGNUP</b>
    //                         </a>
    //                     </li>
    //                 </ul>
    //             </div>
    //             {/* <div className={`navbar-center ${isMenuOpen ? "block" : "hidden"} lg:flex`}>
    //                 <ul className="menu menu-horizontal p-0">
    //                     <li onClick={() => navigate("/")}><a>Home</a></li>
    //                     <li onClick={() => navigate("/about")}><a>About</a></li>
    //                     <li onClick={() => navigate("/services")}><a>Services</a></li>
    //                 </ul>
    //             </div>

    //             <div className="navbar-end gap-4">
    //                 <DarkMode />
    //                 <ul className={`menu menu-horizontal p-0 ${isMenuOpen ? "block" : "hidden"} lg:flex`}>
    //                     <li > <a className="btn btn-warning"><b>LOGIN</b></a></li>
    //                     <li  ><a className="btn btn-warning"><b>SIGNUP</b></a></li>
    //                 </ul>


    //                -- <a className="btn btn-warning"><b>LOGIN</b></a>
    //                 -- <a className="btn btn-warning"><b>SIGNUP</b></a>
    //             </div>
    //              */}
    //         </div>


    //         {/* <div className="navbar bg-neutral text-neutral-content">
    //             <button className="btn btn-ghost text-xl">daisyUI</button>
    //         </div>

    //         <div className="navbar bg-base-300">
    //             <button className="btn btn-ghost text-xl">daisyUI</button>
    //         </div>

    //         <div className="navbar bg-primary text-primary-content">
    //             <button className="btn btn-ghost text-xl">daisyUI</button>
    //         </div> */}
    //     </>
    // )
}

export default Header;
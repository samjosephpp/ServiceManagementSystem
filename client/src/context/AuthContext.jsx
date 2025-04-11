import React, { createContext, useState, useEffect } from 'react';
import { getLoggedInRole, getLoggedInUserDetail } from '../services/utilService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);
    const [loggedUser, setloggedUser] = useState(null);

    useEffect(() => {
        
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds
                if (decodedToken.exp < currentTime) {
                    logout(); // Token expired, log the user out
                } else {
                    setIsLoggedIn(true);
                    const role = getLoggedInRole(token);
                    const userId = getLoggedInUserDetail(token).id;
                    setUserRole(role);
                    setloggedUser(userId);
    
                    // Set a timer to log out when the token expires
                    const timeUntilExpiry = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds
                    const logoutTimer = setTimeout(() => {
                        logout();
                    }, timeUntilExpiry);
    
                    // Clear the timer when the component unmounts or token changes
                    return () => clearTimeout(logoutTimer);
                }
            }           
            
        } catch (error) {
            console.error('Error decoding token:', error);
            logout(); // Log out if token is invalid
        }
    

        //  // console.log('Inside ResolveRole')
        //  const token = localStorage.getItem('token');
        // //  console.log(`Token to be decode: ${token}`)
        //  if (token) {
        //      setIsLoggedIn(true);
        //     //  console.log(`Before Decoded role`)
        //      const role = getLoggedInRole(token);                  
        //     //  console.log(`Decoded role: ${role}`)
        //      let userId = getLoggedInUserDetail(token).id;
 
        //      setUserRole(role);
        //      setloggedUser(userId);
        //  } else {
        //      setIsLoggedIn(false);
        //      setUserRole(null);
        //      setloggedUser(null)
        //  }
       
    }, []);

    const login = (token, refreshToken,  role, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
        setIsLoggedIn(true);
        setUserRole(role);
        setloggedUser(userData);
        // console.log(userData)        
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');    
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        setloggedUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout, loggedUser }}>
            {children}
        </AuthContext.Provider>
    );
};
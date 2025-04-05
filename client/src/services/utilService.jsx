
import {jwtDecode} from 'jwt-decode';

export const getLoggedInRole = (token) =>{
    // console.log(`Token to be decode: ${token}`)
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log(decodedToken); 
            // console.log(`decodedToken ${decodedToken.role}`)
            // console.log(`decodedToken ${decodedToken.role_name}`)

            return decodedToken.role_name;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    else {
        return null;
    }
}

export const getLoggedInUserDetail = (token) => {
    if(!token) {
        token = localStorage.getItem('token');
        // console.log(`token in getLoggedInUserdetail ${token}`)
    }
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
             //id: user._id, email: user.email, role:user.role
            let id = decodedToken.id;
            let email = decodedToken.email;
            let role = decodedToken.role;
            let role_name = decodedToken.role_name;
            return {  id, email, role, role_name };
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    else {
        return null;
    }
}
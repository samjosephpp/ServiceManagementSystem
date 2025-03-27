
import {jwtDecode} from 'jwt-decode';

export const getLoggedInRole = (token) =>{
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log(`Token to be decode: ${token}`)
            console.log(`decodedToken ${decodedToken.role}`)
            return decodedToken.role;
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
            return {  id, email, role };
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    else {
        return null;
    }
}
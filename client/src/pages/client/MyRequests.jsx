import React, { useState, useEffect , useContext} from "react";
import { AuthContext } from '../../context/AuthContext';
import { getServiceRequestsByUserOrProvider } from '../../services/dataServices';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
 
DataTable.use(DT);

const MyRequests = () => {

    const [serviceRequests, setServiceRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { isLoggedIn, userRole , loggedUser} = useContext(AuthContext);
    // console.log(loggedUser)

    useEffect(() => {
        const fetchServiceHistory = async () => {
            setLoading(true);
            const response = await getServiceRequestsByUserOrProvider({userId: loggedUser._id});
            if (response.success) {
                console.log(response);
                
                setServiceRequests(response.data.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        }
        fetchServiceHistory()
    }, []);
    if (loading) {
        return (<h2> <span className="loading loading-spinner loading-lg"></span></h2>)
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
         <h4 className="p-4">Showing {serviceRequests.length} results</h4>        
         {/* <DataTable data={serviceRequests} className="display">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
        </DataTable> */}
        </>
    )
};

export default MyRequests;
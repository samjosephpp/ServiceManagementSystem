import React from "react";

const SingleProvider = (provider, formData, saveItem) => {  
 
  console.log(provider);
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
         
        {/* <p><strong>Name:</strong> {provider.name}</p>
        <p><strong>Code:</strong> {provider.code}</p>
        <p><strong>State:</strong> {provider.stateId.name}</p>
        <p><strong>Location:</strong> {provider.locationId.name}</p>
        <p><strong>Phone:</strong> {provider.phone}</p>
        <p><strong>Email:</strong> {provider.email}</p>
        <p><strong>Address:</strong> {provider.address}</p>
        <p><strong>Is Active:</strong> {provider.isActive ? 'Yes' : 'No'}</p>
        <p><strong>Is Verified:</strong> {provider.isVerified ? 'Yes' : 'No'}</p>
        <p><strong>Created At:</strong> {new Date(provider.createdAt).toLocaleDateString('en-GB')}</p>
        <p><strong>Updated At:</strong> {new Date(provider.updatedAt).toLocaleDateString('en-GB')}</p> */}
        <div className="flex justify-end mt-4">
          {/* <button className="btn btn-secondary btn-sm mr-2" onClick={closeModal}>Close</button> */}
          <button className="btn btn-primary btn-sm" onClick={() => { saveItem(provider) }}>Save</button>
        </div>
      </div>
    )
}
export default SingleProvider;
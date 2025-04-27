
const EditRequestForm = ({ request, editedRequest, closeEditModal }) => {
    // const [editedRequest, setEditedRequest] = useState(request);
     

    return (
        <form //nSubmit={handleSubmit} 
            className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1  xs:grid-cols-1  gap-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2 " id="gridForm">
                <div className="justify-center items-center ">
                    <label className="block text-gray-700 font-bold mb-2" > Request ID </label>
                    <label className="block text-gray-700  mb-2" > {request.requestNumber} </label>
                </div>
                <div className="justify-center items-center ">
                    <label className="block text-gray-700 font-bold mb-2" > Customer </label>
                    <label className="block text-gray-700  mb-2" > {(request.createdBy && request.createdBy.clientId ? request.createdBy.clientId.name : '')} </label>
                </div>
                <div className="justify-center items-center ">

                    <label className="block text-gray-700 font-bold mb-2" > Request Status </label>
                    <label className="inline-block text-gray-700 font-bold m-4" htmlFor="pending" >
                        <input className="checkbox" type="radio" name="status" id="pending" value="Pending" checked={request.status === 'Pending'} onChange={(e) => setEditedRequest({ ...editedRequest, status: e.target.value })} />
                        &nbsp; Pending
                    </label>
                    <label className="inline-block text-gray-700 font-bold m-4" htmlFor="accepted" >
                        <input className="checkbox" type="radio" name="status" id="accepted" value="Accepted" checked={request.status === 'Approved'} onChange={(e) => setEditedRequest({ ...editedRequest, status: e.target.value })} />
                        &nbsp; Approved
                    </label>
                    <label className="inline-block text-gray-700 font-bold m-4" htmlFor="declined" >
                        <input className="checkbox" type="radio" name="status" id="declined" value="Declined" checked={request.status === 'Declined'} onChange={(e) => setEditedRequest({ ...editedRequest, status: e.target.value })} />
                        &nbsp; Declined
                    </label>
                    <label className="inline-block text-gray-700 font-bold m-4" htmlFor="completed" >
                        <input className="checkbox" type="radio" name="status" id="completed" value="Completed" checked={request.status === 'Completed'} onChange={(e) => setEditedRequest({ ...editedRequest, status: e.target.value })} />
                        &nbsp; Completed
                    </label>
                </div>
                <div className="justify-center items-center ">
                    <label className="block text-gray-700 font-bold mb-2" > Payment Status </label>
                    <label className="inline-block text-gray-700 font-bold m-4" htmlFor="isPaid" >
                        <input className="checkbox" type="radio" name="status" id="isPaid" value="isPaid" checked={request.status === 'isPaid'} onChange={(e) => setEditedRequest({ ...editedRequest, status: e.target.value })} />
                        &nbsp; isPaid
                    </label>
                </div>
                <div className="modal-action mt-3">
                    <button type="submit" className="btn btn-success btn-sm ">  Submit </button>
                    <button className="btn btn-default btn-sm" onClick={closeEditModal}>Close</button>
                </div>
            </div>
        </form>
    )
}

export default EditRequestForm;
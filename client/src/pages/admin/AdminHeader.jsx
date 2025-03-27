import React from "react";

const AdminHeader = () => {
    return (
        // <div className="bg-red text-white p-3">Client Header</div>
        <>
            <div className="navbar bg-neutral text-neutral-content">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>

            <div className="navbar bg-base-300">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>

            <div className="navbar bg-primary text-primary-content">
                <button className="btn btn-ghost text-xl">daisyUI</button>
            </div>
        </>
    )
}

export default AdminHeader;
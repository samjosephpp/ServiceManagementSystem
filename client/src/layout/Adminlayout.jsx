import React from "react";
import { Outlet } from "react-router-dom";

import Header from '../pages/admin/AdminHeader'

const Adminlayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default Adminlayout;
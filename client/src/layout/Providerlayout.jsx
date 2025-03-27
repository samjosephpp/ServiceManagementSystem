import React from "react";
import { Outlet } from "react-router-dom";

import Header from '../pages/providers/ProviderHeader'

const Providerlayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default Providerlayout;
import React from "react";
import { Outlet } from "react-router-dom";

import Header from '../pages/providers/ProviderHeader'
import Footer from "../pages/client/Footer";

const Providerlayout = () => {
    return (
        // <div>
        //     <Header />
        //     <Outlet />
        // </div>
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow p-0">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Providerlayout;
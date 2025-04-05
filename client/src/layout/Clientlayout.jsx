import React from "react";
import { Outlet } from "react-router-dom";

import Header from '../pages/client/Header'
import Footer from "../pages/client/Footer";

const Clientlayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow p-0">
                <Outlet />
            </div>
            <Footer />

        </div>
    )
}

export default Clientlayout;
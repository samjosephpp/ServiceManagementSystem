
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Error 404: Page Not Found</h1>
                <p className="mt-4 text-error">Sorry, the page you are looking for does not exist.</p>
                 <Link to="/" className="mt-4 text-red-950 hover:underline-none  btn btn-md btn-warning">
                    Go back to Homepage
                </Link>
            </div>

        </div>
    );   
}

export default ErrorPage;

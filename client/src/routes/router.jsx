import { createBrowserRouter } from "react-router-dom"

import ErrorPage from "../pages/shared/ErrorPage";

import Clientlayout from "../layout/Clientlayout";
import Home from "../pages/client/Home";
import About from "../pages/client/About";
import Contactus from "../pages/client/Contactus";
import Services from "../pages/client/Services";
import Login from "../pages/shared/login";
import Signup from "../pages/shared/signup";
import RequestService from "../pages/client/RequestService";
import MyRequests from "../pages/client/MyRequests";

import Adminlayout from "../layout/Adminlayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/Manageusers";    
import ManageLocations from "../pages/admin/ManageLocations";
import ManageProviders from "../pages/admin/Manageproviders";
import Manageproviderservices from '../pages/admin/Manageproviderservices';
import ServiceRequests from "../pages/admin/ServiceRequests";
import AddProviderUser from "../pages/admin/addProvideruser"
import AdminFeedbacks  from  "../pages/admin/Feedbacks"


import ServiceProviderlayout from "../layout/Providerlayout";
import Dashboard   from "../pages/providers/dashboard";
import Myservices from "../pages/providers/myservices";
import Requests from "../pages/providers/Requests" ; 
import ProviderFeedbacks from "../pages/providers/Feedbacks"

import Payment from "../pages/client/payment";
import Feedback from "../pages/client/feedback";


export let router = createBrowserRouter([
    {
    //   path: "/",
    //   Component: Root,
    //   children: [
    //     {
    //       path: "shows/:showId",
    //       Component: Show,
    //       loader: ({ request, params }) =>
    //         fetch(`/api/show/${params.id}.json`, {
    //           signal: request.signal,
    //         }),
    //     },
    //   ],
    // },
    path: "/",
    element:   <Clientlayout/>,
    errorElement: <ErrorPage /> ,// <h1>Error page</h1>,
    children:[
        {
            path: "",
            element: <Home/>
        }, 
        {
            path: "about",
            element:  <About/>
        }, 
        {
            path: "contactus",
            element:  <Contactus/>
        }, 
        {
            path: "Services",
            element:  <Services/>
        }, 
        {
            path: "login",
            element:  <Login/>
        }, 
        {
            path: "signup",
            element:  <Signup/>
        }, 
        {
            path: "request-service",
            element:  <RequestService/>
        }, 
        {
            path: "myrequest",
            element:  <MyRequests />
        }, 
        {
            path: "payment",    
            element:  <Payment/>
        },
        {
            path: "feedback",    
            element:  <Feedback/>
        },
    ]
    },   
    {
        path: "/admin",      
        element:   <Adminlayout/>,
        errorElement: <ErrorPage /> ,//<h1>Error page</h1>,
        children:[
            {
                path: "",
                element: <AdminDashboard/>
            },
            {
                path: "dashboard",
                element: <AdminDashboard/>
            },
            {
                path: "users",
                element: <ManageUsers/>
            }, 
            {
                path: "locations",
                element: <ManageLocations/>
            },
            {
                path: "manageproviders",
                element: <ManageProviders/>
            },
            {
                path: "providerservices",
                element: <Manageproviderservices/>
            },
            {
                path: "serviceRequests",
                element: <ServiceRequests/>
            },  
            {
                path: "addprovideruser",
                element: <AddProviderUser/>
            },
            {
                path: "feedbacks",
                element: <AdminFeedbacks/>
            },
        ]       
    }  ,
    {
        path: "/serviceprovider",
        element: <ServiceProviderlayout/>,       
        errorElement:<ErrorPage />  ,//<h1>Error page</h1>,
        children:[
            {
                path: "",
                element: <Dashboard/>
            },
            {
                path: "dashboard",
                element: <Dashboard/>
            }, 
            {
                path: "myservices",
                element: <Myservices/>
            }, 
            {
                path: "requests",
                element: <Requests/>
            }, 
            {
                path: "feedbacks",
                element: <ProviderFeedbacks/>
            }, 
        ]       
    },
 
    
  ]);
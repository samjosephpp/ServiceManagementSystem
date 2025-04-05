import { createBrowserRouter } from "react-router-dom"


import Clientlayout from "../layout/Clientlayout";
import Home from "../pages/client/Home";
import About from "../pages/client/About";
import Services from "../pages/client/Services";
import Login from "../pages/shared/login";
import Signup from "../pages/shared/signup";
import RequestService from "../pages/client/RequestService";
import MyRequests from "../pages/client/MyRequests";


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
    errorElement: <h1>Error page</h1>,
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
         
    ]
    },   
    {
        path: "/admin",
        element: <h1>This is admin page</h1>,
        // element:   <Adminlayout/>,
        errorElement: <h1>Error page</h1>,
        children:[
            {

            }
        ]       
    }  ,
    
  ]);
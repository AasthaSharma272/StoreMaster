"use client"; // Indicates that this file should be executed on the client side

import { Toaster } from "react-hot-toast"; // Importing the Toaster component from react-hot-toast

// Defining a ToasterProvider component
export const ToasterProvider = () => {
    // Returning the Toaster component
    // The Toaster component provides a way to display toast notifications for various events, including errors
    // By rendering the Toaster component at the top level of your application, it will be able to display toast notifications globally
    return <Toaster />;
}

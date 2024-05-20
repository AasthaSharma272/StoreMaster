"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal"; // Importing the StoreModal component.

/**
 * Component to provide modals throughout the application.
 * It renders the StoreModal component once the component is mounted.
 * @returns {JSX.Element|null} - The ModalProvider component.
 */
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false); // State to track whether the component is mounted.

    useEffect(() => {
        setIsMounted(true); // Setting isMounted to true when the component is mounted.
    }, []);

    // If the component is not yet mounted, return null. Helps in the server side
    if(!isMounted) {
        return null;
    }

    // Render the StoreModal component.
    return(
        <>
            <StoreModal />
        </>
    );
};
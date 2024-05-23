"use client"; // Indicates that this file should be executed on the client side

import { useStoreModal } from "@/hooks/use-store-modal"; // Importing the useStoreModal custom hook
import { useEffect } from "react"; // Importing useEffect hook from React

// Define the SetupPage component
const SetupPage = () => {
    // Retrieve the onOpen function and isOpen state from the useStoreModal hook
    const onOpen = useStoreModal((state) => state.onOpen);
    const isOpen = useStoreModal((state) => state.isOpen);

    // Effect hook to open the store modal when it's not already open
    useEffect(() => {
        // If the store modal is not open, call the onOpen function to open it
        if (!isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]); // Depend on isOpen and onOpen to trigger the effect when they change

    // The SetupPage component doesn't render anything directly, it just triggers the store modal
    return null;
}

// Export the SetupPage component as the default export
export default SetupPage;
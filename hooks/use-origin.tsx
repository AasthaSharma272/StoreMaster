import { useState, useEffect } from "react";

// Custom hook to get the origin of the current window location
export const useOrigin = () => {
    // State to track if the component is mounted
    const [mounted, setMounted] = useState(false);

    // Get the origin of the window location, or an empty string if window is undefined
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';

    // useEffect hook to set mounted to true when component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // If the component is not mounted yet, return an empty string
    if(!mounted){
        return '';
    }

    // Return the origin
    return origin;
}
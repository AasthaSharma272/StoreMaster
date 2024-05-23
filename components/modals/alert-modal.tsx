"use client";

// import statements
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

// Define props for the AlertModal component
interface AlertModalProps{
    isOpen: boolean; // Whether the modal is open or closed
    onClose: () => void; // Function to close the modal
    onConfirm: () => void; // Function to confirm the action
    loading: boolean; // Whether the modal is in a loading state
}

// AlertModal component
export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false); // State to track if component is mounted

    // useEffect hook to set isMounted to true when component mounts
    useEffect(() => {
        setIsMounted(true);
    }, [])

    // If the component is not mounted yet, return null
    if (!isMounted){
        return null;
    }

    // Render the AlertModal component
    return(
        <Modal
        title="Are you sure?"
        description="This action cannot be done"
        isOpen={isOpen}
        onClose={onClose}
        >
            {/* Buttons for Cancel and Continue actions */}
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    )
}
"use client";

import { useStoreModal } from "@/hooks/use-store-modal"; // Importing the custom hook to manage modal state.
import { Modal } from "@/components/ui/modal"; // Importing the Modal component.

/**
 * Component to render a modal for creating a store.
 * It utilizes the useStoreModal hook to manage the modal state.
 * @returns {JSX.Element} - The StoreModal component.
 */
export const StoreModal = () => {
    const storeModal = useStoreModal(); // Accessing the modal state and functions.

    return(
        <Modal
            title="Create Store" // Title for the modal.
            description="Add a new store" // Description displayed in the modal.
            isOpen={storeModal.isOpen} // Indicates whether the modal is open or closed.
            onClose={storeModal.onClose} // Function to close the modal
        >
            Future Create Store form
        </Modal>
    );
};
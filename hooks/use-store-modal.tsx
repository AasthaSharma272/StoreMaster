import { create } from "zustand";

/**
 * Interface defining the shape of the modal store state.
 */
interface useStoreModalStore {
    isOpen: boolean; // Indicates whether the modal is open or closed.
    onOpen: () => void; // Function to open the modal.
    onClose: () => void; // Function to close the modal.
};

/**
 * Custom hook to manage modal state using Zustand.
 * @returns {useStoreModalStore} - The modal store object containing state and functions to manipulate it.
 */
export const useStoreModal = create<useStoreModalStore>((set) => ({
    isOpen: false, // Initially, the modal is closed.
    onOpen: () => set({isOpen: true}), // Function to set the modal to open state.
    onClose: () => set({isOpen: false}) // Function to set the modal to closed state.
}));
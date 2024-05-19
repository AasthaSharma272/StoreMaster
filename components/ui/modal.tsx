"use client";
// created the modal component for creating a store on dashboard from dialog component
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Props for the Modal component.
 * @property {string} title - The title of the modal.
 * @property {string} description - The description or additional information displayed in the modal.
 * @property {boolean} isOpen - A boolean indicating whether the modal is currently open.
 * @property {() => void} onClose - A function to be called when the modal is closed.
 * @property {React.ReactNode} [children] - Optional React nodes to be rendered inside the modal.
 */
interface ModalProps{
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

/**
 * A reusable modal component run when imported modal
 * @param {ModalProps} props - Props for configuring the modal behavior and content.
 * @returns {JSX.Element} - A modal component.
 */
export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
    /**
     * Handles the change in the modal's open state.
     * Calls the onClose function when the modal is closed.
     * @param {boolean} open - Indicates whether the modal is open.
     */
    const onChange = (open: boolean) => {
        if(!open) {
            onClose();
        }
    };
    // returns the created modal with props given to parm
    return(
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}
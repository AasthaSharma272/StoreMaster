"use client";

// import statements
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

// Props for the cell action component
interface CellActionProps {
    data: BillboardColumn // Data for the billboard
}

// Cell action component
export const CellAction: React.FC<CellActionProps> = ({
    data
}: {
    data: BillboardColumn
}) => {
    
    const router = useRouter(); // Next.js router hook
    const params = useParams(); // Parameters from the URL

    const [open, setOpen] = useState(false); // State for modal visibility
    const [loading, setLoading] = useState(false); // State for loading status

    // Function to copy billboard ID to clipboard
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Billboard Id copied to the clipboard.");
    }

    // Function to handle billboard deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given billboard
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            toast.success("Billboard Deleted.");
        } catch (error) {
            toast.error("Make sure you remove categories using this billboard first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the component
    return (
        <>
            {/* Alert modal for delete confirmation */}
            <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            {/* Dropdown menu for actions */}
            <DropdownMenu>
                {/* Dropdown menu trigger */}
                <DropdownMenuTrigger asChild>
                    {/* Button to trigger dropdown menu */}
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                {/* Dropdown menu content */}
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    {/* Copy ID action */}
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4"/>
                        Copy Id
                    </DropdownMenuItem>
                     {/* Edit action */}                
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit
                    </DropdownMenuItem>
                    {/* Delete action */}
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
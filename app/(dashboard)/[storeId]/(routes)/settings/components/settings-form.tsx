"use client";

// import statements
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { APiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { Store } from "@prisma/client";

// Define props for the SettingsForm component
interface SettingsFormProps{
    initialData: Store;
}

// Define form schema using Zod for update store name
const formSchema = z.object({
    name: z.string().min(1), // Name field is required and should have at least 1 character
});


// Define type for form values based on form schema
type SettingsFormValues = z.infer<typeof formSchema>;

// SettingsForm component
export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js
    const origin = useOrigin(); // Get origin using custom hook

    // useForm hook to manage form state and validation
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData // Set initial form values
    });

    // Function to handle form submission
    const onSubmit = async (data: SettingsFormValues) => {
        try{
            // Set loading status to true and call Patch api to update store
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store Updated!");
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle store deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given store
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/"); // Redirect to home page
            toast.success("Store Deleted.");
        } catch (error) {
            toast.error("Make sure you remove all products and categories first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the SettingsForm component
    return(
        <>
         {/* Delete confirmation modal */}
            <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
             {/* Heading section */}
            <div className="flex items-center justify-between">
                <Heading 
                title="Settings"
                description="Manage Store Preferences"
                />
                {/* Delete button */}
                <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
             {/* Separator */}
            <Separator />
            {/* Form section to update store*/}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store Name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     {/* Save changes button */}
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
            {/* Separator */}
            <Separator />
            {/* API section for different API's to connect to frontend */}
            <APiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}
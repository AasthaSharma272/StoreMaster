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
import { Size } from "@prisma/client";

// Define props for the SizeForm component
interface SizeFormProps{
    initialData: Size | null;
}

// Define form schema using Zod for update/creating size
const formSchema = z.object({
    name: z.string().min(1), // name field is required and should have at least 1 character
    value: z.string().min(1) // value field is required and should have at least 1 character
});


// Define type for form values based on form schema
type SizeFormValues = z.infer<typeof formSchema>;

// SizeForm component
export const SizeForm: React.FC<SizeFormProps> = ({
    initialData // expecting initial data of size or could be null
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    const title = initialData ? "Edit size" : "Create size"; // title based on initial data given (edit size) or null (create new size)
    const description = initialData ? "Edit a size" : "Add a new size"; // description based on initial data given (edit size) or null (create new size)
    const toastMessage = initialData ? "Size Updated!" : "Size Created!"; // toast message based on initial data given (edit size) or null (create new size)
    const action = initialData ? "Save changes" : "Create"; // button action message based on initial data given (edit size) or null (create new size)
    

    // useForm hook to manage form state and validation
    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData || {
            name: '',
            value: ''
        } // Set initial form values if given (edit a size) or blank (new size) 
    });

    // Function to handle form submission
    const onSubmit = async (data: SizeFormValues) => {
        try{
            // Set loading status to true and call Patch api to update size or Post api to create a new size
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            }
            else{
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`); // takes you back to main size page
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle size deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given size
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`); // Redirect to home page
            toast.success("Size Deleted.");
        } catch (error) {
            toast.error("Make sure you remove all products using this size first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the SizeForm component
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
                title={title}
                description={description}
                />
                {/* Delete button */}
                {initialData && (
                <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
                )}
            </div>
             {/* Separator */}
            <Separator />
            {/* Form section to update size */}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    {/* Form section to update size name and value*/}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Form section to update size name */}
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section to update size value */}
                        <FormField 
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size value" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     {/* Save changes or create button */}
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}
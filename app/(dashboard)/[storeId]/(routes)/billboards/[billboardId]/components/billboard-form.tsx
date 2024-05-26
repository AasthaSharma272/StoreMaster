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
import ImageUpload from "@/components/ui/image-upload";
import { Billboard } from "@prisma/client";

// Define props for the BillboardForm component
interface BillboardFormProps{
    initialData: Billboard | null;
}

// Define form schema using Zod for update/creating billboard
const formSchema = z.object({
    label: z.string().min(1), // label field is required and should have at least 1 character
    imageUrl: z.string().min(1) // imageurl field is required and should have at least 1 character
});


// Define type for form values based on form schema
type BillboardFormValues = z.infer<typeof formSchema>;

// BillboardForm component
export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData // expecting initial data of billboard or could be null
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    const title = initialData ? "Edit Billboard" : "Create Billboard"; // title based on initial data given (edit billboard) or null (create new billboard)
    const description = initialData ? "Edit a billboard" : "Add a new billboard"; // description based on initial data given (edit billboard) or null (create new billboard)
    const toastMessage = initialData ? "Billboard Updated!" : "Billboard Created!"; // toast message based on initial data given (edit billboard) or null (create new billboard)
    const action = initialData ? "Save changes" : "Create"; // button action message based on initial data given (edit billboard) or null (create new billboard)
    

    // useForm hook to manage form state and validation
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        } // Set initial form values if given (edit a billboard) or blank (new billboard) 
    });

    // Function to handle form submission
    const onSubmit = async (data: BillboardFormValues) => {
        try{
            // Set loading status to true and call Patch api to update billboard or Post api to create a new billboard
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            }
            else{
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`); // takes you back to main billboard page
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle billboard deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given billboard
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`); // Redirect to home page
            toast.success("Billboard Deleted.");
        } catch (error) {
            toast.error("Make sure you remove categories using this billboard first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the BillboardForm component
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
            {/* Form section to update billboard */}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    {/* Form section to update billboard image*/}
                    <FormField 
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                value={field.value ? [field.value] : []}
                                disabled={loading}
                                onChange={(url) => field.onChange(url)}
                                onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        {/* Form section to update billboard label*/}
                        <FormField 
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard Label" {...field}/>
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
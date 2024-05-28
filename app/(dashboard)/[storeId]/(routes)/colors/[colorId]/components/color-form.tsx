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
import { Color } from "@prisma/client";

// Define props for the ColorForm component
interface ColorFormProps{
    initialData: Color | null;
}

// Define form schema using Zod for update/creating Color
const formSchema = z.object({
    name: z.string().min(1), // name field is required and should have at least 1 character
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code"
    }) // value field is required and should have at least 4 character and be a regex exp of color
});


// Define type for form values based on form schema
type ColorFormValues = z.infer<typeof formSchema>;

// ColorForm component
export const ColorForm: React.FC<ColorFormProps> = ({
    initialData // expecting initial data of Color or could be null
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    const title = initialData ? "Edit color" : "Create color"; // title based on initial data given (edit Color) or null (create new Color)
    const description = initialData ? "Edit a color" : "Add a new color"; // description based on initial data given (edit color) or null (create new color)
    const toastMessage = initialData ? "Color Updated!" : "Color Created!"; // toast message based on initial data given (edit color) or null (create new color)
    const action = initialData ? "Save changes" : "Create"; // button action message based on initial data given (edit color) or null (create new color)
    

    // useForm hook to manage form state and validation
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData || {
            name: '',
            value: ''
        } // Set initial form values if given (edit a color) or blank (new color) 
    });

    // Function to handle form submission
    const onSubmit = async (data: ColorFormValues) => {
        try{
            // Set loading status to true and call Patch api to update color or Post api to create a new color
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            }
            else{
                await axios.post(`/api/${params.storeId}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`); // takes you back to main color page
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle color deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given color
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`); // Redirect to home page
            toast.success("Color Deleted.");
        } catch (error) {
            toast.error("Make sure you remove all products using this color first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the ColorForm component
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
            {/* Form section to update color */}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    {/* Form section to update color name and value*/}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Form section to update color name */}
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Color name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section to update color value */}
                        <FormField 
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                    <Input disabled={loading} placeholder="Color value" {...field}/>
                                    <div 
                                    className="border p-4 rounded-full"
                                    style={{ backgroundColor: field.value}}
                                    />
                                    </div>
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
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
import { Billboard, Category } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define props for the CategoryForm component
interface CategoryFormProps{
    initialData: Category | null;
    billboards: Billboard[];
}

// Define form schema using Zod for update/creating category
const formSchema = z.object({
    name: z.string().min(1), // name field is required and should have at least 1 character
    billboardId: z.string().min(1) // billboardid field is required and should have at least 1 character
});


// Define type for form values based on form schema
type CategoryFormValues = z.infer<typeof formSchema>;

// CategoryForm component
export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData, billboards // expecting initial data of category or could be null and billboards for dropdown menu
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    const title = initialData ? "Edit Category" : "Create Category"; // title based on initial data given (edit category) or null (create new category)
    const description = initialData ? "Edit a Category" : "Add a new Category"; // description based on initial data given (edit category) or null (create new category)
    const toastMessage = initialData ? "Category Updated!" : "Category Created!"; // toast message based on initial data given (edit category) or null (create new category)
    const action = initialData ? "Save changes" : "Create"; // button action message based on initial data given (edit category) or null (create new category)
    

    // useForm hook to manage form state and validation
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        } // Set initial form values if given (edit a category) or blank (new category) 
    });

    // Function to handle form submission
    const onSubmit = async (data: CategoryFormValues) => {
        try{
            // Set loading status to true and call Patch api to update category or Post api to create a new category
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            }
            else{
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`); // takes you back to main category page
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle category deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given category
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`); // Redirect to category page
            router.refresh();
            toast.success("Category Deleted.");
        } catch (error) {
            toast.error("Make sure you remove products using this category first.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the CategoryForm component
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
            {/* Form section to update category */}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        {/* Form section to update category name */}
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Category Name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section to update billboard selected */}
                        <FormField 
                        control={form.control}
                        name="billboardId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a billboard"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Select a billboard enity given to match with Categories */}
                                        {billboards.map((billboard) => (
                                            <SelectItem
                                            key={billboard.id}
                                            value={billboard.id}
                                            >
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Product, Image, Category, Size, Color } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Define props for the ProductForm component
interface ProductFormProps{
    initialData: Product & {
        images: Image[]
    } | null,
    categories: Category[],
    sizes: Size[],
    colors: Color[],
}

// Define form schema using Zod for update/creating product
const formSchema = z.object({
    name: z.string().min(1), // name field is required and should have at least 1 character
    images: z.object({ url: z.string() }).array(), // images field is required and should be an array
    price: z.coerce.number().min(1), // price field is required and should have at least 1 character
    categoryId: z.string().min(1), // category field is required and should have at least 1 character
    colorId: z.string().min(1), // color field is required and should have at least 1 character
    sizeId: z.string().min(1), // size field is required and should have at least 1 character
    isFeatured: z.boolean().default(false).optional(), // featured field is not required and deafault set to false
    isArchived: z.boolean().default(false).optional() // archived field is not required and deafault set to false
});


// Define type for form values based on form schema
type ProductFormValues = z.infer<typeof formSchema>;

// ProductForm component
export const ProductForm: React.FC<ProductFormProps> = ({
    initialData, // expecting initial data of product or could be null
    categories, // categories to select from
    sizes, // sizes to select from
    colors // colors to select from
}) => {
    const [open, setOpen] = useState(false); // State for controlling delete modal
    const [loading, setLoading] = useState(false); // State for loading status
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    const title = initialData ? "Edit Product" : "Create Product"; // title based on initial data given (edit product) or null (create new product)
    const description = initialData ? "Edit a product" : "Add a new product"; // description based on initial data given (edit product) or null (create new product)
    const toastMessage = initialData ? "Product Updated!" : "Product Created!"; // toast message based on initial data given (edit product) or null (create new product)
    const action = initialData ? "Save changes" : "Create"; // button action message based on initial data given (edit product) or null (create new product)
    

    // useForm hook to manage form state and validation
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema), // Use Zod resolver for validation
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false
        } // Set initial form values if given (edit a product) or blank (new product) 
    });

    // Function to handle form submission
    const onSubmit = async (data: ProductFormValues) => {
        try{
            // Set loading status to true and call Patch api to update product or Post api to create a new product
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            }
            else{
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`); // takes you back to main product page
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong."); // Show error toast
        } finally{
            setLoading(false);
        }
    }

    // Function to handle product deletion
    const onDelete = async() => {
        try{
            // Set loading status to true and call delete api to delete the given product
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`); // Redirect to home page
            router.refresh();
            toast.success("Product Deleted.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally{
            setLoading(false);
            setOpen(false); // Close delete modal
        }
    }

    // Render the ProductForm component
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
            {/* Form section to update product */}
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 w-full"
                >
                    {/* Form section to update product images */}
                    <FormField 
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                value={field.value.map((image) => image.url)}
                                disabled={loading}
                                onChange={(url) => field.onChange([...field.value, { url }])}
                                onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        {/* Form section to update product name */}
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Product name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section to update product price */}
                        <FormField 
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section to update product category, size and color */}
                        <FormField 
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Select a category enity given to match with Product */}
                                        {categories.map((category) => (
                                            <SelectItem
                                            key={category.id}
                                            value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="sizeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Select a size enity given to match with Product */}
                                        {sizes.map((size) => (
                                            <SelectItem
                                            key={size.id}
                                            value={size.id}
                                            >
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="colorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a color"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Select a color enity given to match with Product */}
                                        {colors.map((color) => (
                                            <SelectItem
                                            key={color.id}
                                            value={color.id}
                                            >
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Form section for the is Featured option */}
                        <FormField 
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-8 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>
                                        This product will appear on the home page
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                        />
                        {/* Form section for the is Archived option */}
                        <FormField 
                        control={form.control}
                        name="isArchived"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-8 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>
                                        This product will not appear anywhere in the store
                                    </FormDescription>
                                </div>
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
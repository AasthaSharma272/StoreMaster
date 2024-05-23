"use client";

import * as z from "zod"; // Importing everything from zod to create the store form
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for integrating Zod with react-hook-form.

import axios from "axios"; // Importing axios to call api

import { useStoreModal } from "@/hooks/use-store-modal"; // Importing the custom hook to manage modal state.

import { Modal } from "@/components/ui/modal"; // Importing the Modal component.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Importing form components.
import { Input } from "@/components/ui/input"; // Importing Input component.
import { Button } from "@/components/ui/button"; // Importing Button component.

import { useForm } from "react-hook-form"; // Importing useForm from react-hook-form for form handling.
import toast from "react-hot-toast"; // Importing toast from react-hot-toast for notifications

import { useState } from "react"; // Importing use state from React

// form schema using Zod, requiring 'name' string field with at least one character.
const formSchema = z.object({
    name: z.string().min(1),
});

/**
 * Component to render a modal and form for creating a store.
 * It utilizes the useStoreModal hook to manage the modal state amd form component with zod.
 * @returns {JSX.Element} - The StoreModal component.
 */
export const StoreModal = () => {
    const storeModal = useStoreModal(); // Accessing the modal state and functions.

    const [loading, setLoading] = useState(false); // use state to get functions of loading when the form is still being created

    // Setting up useForm with Zod resolver and default values.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    // Function to handle form submission.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            // when submitted set loading to the true which disables rest of form components
            setLoading(true);

            // call the api in api package to create the store with the name as values given
            const response = await axios.post('/api/stores', values);

            // after creating the first store, redirect to store dashboard
            window.location.assign(`/${response.data.id}`);
        } catch (error){
            // Error notification
            toast.error("Something went wrong.");
        } finally {
            // set the loading back to false to allow submission again
            setLoading(false);
        }
    };

    return(
        <Modal
            title="Create Store" // Title for the modal.
            description="Add a new store" // Description displayed in the modal.
            isOpen={storeModal.isOpen} // Indicates whether the modal is open or closed.
            onClose={storeModal.onClose} // Function to close the modal
        >
            <div>
                {/* Form section */}
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {/* Form field for store name */}
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} 
                                        placeholder="E-Commerce" 
                                        {...field}/>
                                    </FormControl>
                                    <FormMessage /> {/* Form error message */}
                                </FormItem>
                            )}
                            />
                            {/* Buttons for form actions */}
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                {/* Cancel button */}
                                <Button
                                disabled={loading} 
                                variant={"outline"}
                                onClick={storeModal.onClose}>
                                    Cancel
                                </Button>
                                {/* Submit button */}
                                <Button disabled={loading} type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
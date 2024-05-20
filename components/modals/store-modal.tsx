"use client";

import * as z from "zod"; // importing everything from zod to create the store form

import { useStoreModal } from "@/hooks/use-store-modal"; // Importing the custom hook to manage modal state.
import { Modal } from "@/components/ui/modal"; // Importing the Modal component.
import { useForm } from "react-hook-form"; // Importing useForm from react-hook-form for form handling.
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for integrating Zod with react-hook-form.
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Importing form components.
import { Input } from "@/components/ui/input"; // Importing Input component.
import { Button } from "@/components/ui/button"; // Importing Button component.

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

    // Setting up useForm with Zod resolver and default values.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    // Function to handle form submission.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // TODO: create store
    }

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
                                        <Input placeholder="E-Commerce" {...field}/>
                                    </FormControl>
                                    <FormMessage /> {/* Form error message */}
                                </FormItem>
                            )}
                            />
                            {/* Buttons for form actions */}
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                {/* Cancel button */}
                                <Button 
                                variant={"outline"}
                                onClick={storeModal.onClose}>
                                    Cancel
                                </Button>
                                {/* Submit button */}
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
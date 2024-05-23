// import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

// Define props for the SettingsPage component
interface SettingsPageProps {
    params: {
        storeId: string; // ID of the store
    }
};

// SettingsPage component rendered on the settings route
const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const { userId } = auth(); // Get user ID using Clerk's authentication utility

    // If user is not authenticated, redirect to sign-in page
    if(!userId){
        redirect("/sign-in");
    }

    // Find the store with the provided store ID and user ID
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    });

    // If store is not found, redirect to home page
    if (!store){
        redirect("/");
    }

    // Render the SettingsPage component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Render the SettingsForm component, the main component to display on settings page with initial data from the store */}
            <SettingsForm initialData={store}/>
            </div>
        </div>
    );
}

export default SettingsPage;
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";

import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

// Define Navbar component as an asynchronous function
const Navbar = async () => {
    // Retrieve the user ID using Clerk's auth() function
    const { userId } = auth();

    // If user ID is not available (user is not authenticated), redirect to sign-in page
    if (!userId) {
        redirect("/sign-in");
    }

    // Retrieve stores associated with the user from the database
    const stores = await prismadb.store.findMany({
        where: {
            userId: userId
        },
    });

    // Return the JSX for the Navbar component
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                {/* Render the StoreSwitcher component */}
                {/* Pass the retrieved stores as items */}
                {/* Apply margin-top of 3 to StoreSwitcher */}
                <StoreSwitcher items={stores} className="mt-3" />

                {/* Render the MainNav component */}
                {/* Apply margin-top of 4 and horizontal margin of 6 to MainNav */}
                <MainNav className="mx-6 mt-4" />

                {/* Render the UserButton component */}
                {/* Align it to the right side */}
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
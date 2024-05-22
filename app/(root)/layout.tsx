import prismadb from "@/lib/prismadb"; // Importing prismadb instance
import { auth } from "@clerk/nextjs/server"; // Importing auth function from @clerk/nextjs/server
import { redirect } from "next/navigation"; // Importing redirect function from next/navigation

// Defining the SetupLayout component
export default async function SetupLayout({
    children
}: {
    children: React.ReactNode;
}) {
    // Extracting userId from authenticated session
    const { userId } = auth();

    // Redirecting to sign-in page if user is not authenticated
    if (!userId) {
        redirect('/sign-in');
    }

    // Finding the store associated with the current user
    const store = await prismadb.store.findFirst({
        where: {
            userId: userId
        }
    });

    // Redirecting to the store's dashboard if a store is found for the current user
    if (store) {
        redirect(`/${store.id}`);
    }

    // Rendering the SetupLayout component with children components
    return (
        <>
            {children}
        </>
    );
}
import prismadb from "@/lib/prismadb"; // Importing prismadb instance
import { auth } from "@clerk/nextjs/server"; // Importing auth function from @clerk/nextjs/server
import { redirect } from "next/navigation"; // Importing redirect function from next/navigation

// Defining the DashboardLayout component for each of the store with storeId
export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) {
    // Extracting userId from authenticated session
    const { userId } = auth();

    // Redirecting to sign-in page if user is not authenticated
    if (!userId) {
        redirect('/sign-in');
    }

    // Finding the store associated with the provided storeId and userId
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    });

    // Redirecting to home page if store is not found
    if (!store) {
        redirect('/');
    }

    // Rendering the DashboardLayout component with navbar and children components
    return (
        <>
            <div>This will be a navbar</div>
            {children}
        </>
    );
}
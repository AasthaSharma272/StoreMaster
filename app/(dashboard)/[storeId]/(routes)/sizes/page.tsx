// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";

// Functional component for the SizesPage
const SizesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the sizes connected to the store id in descending order
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the size column data structure to match the data table settings
    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <SizesClient data={formattedSizes}/> {/* Rendering the SizeClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default SizesPage; // Exporting SizesPage component, this is where user lands after selecting Sizes on Navbar
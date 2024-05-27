// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

// Functional component for the BillboardsPage
const BillboardsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the billboards connected to the store id in descending order
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the billboard column data structure to match the data table settings
    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <BillboardClient data={formattedBillboards}/> {/* Rendering the BillboardClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default BillboardsPage; // Exporting BillboardsPage component, this is where user lands after selecting Billboards on Navbar
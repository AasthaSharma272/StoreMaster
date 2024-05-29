// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";

// Functional component for the ColorsPage
const ColorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the colors connected to the store id in descending order
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the color column data structure to match the data table settings
    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <ColorsClient data={formattedColors}/> {/* Rendering the ColorClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default ColorsPage; // Exporting ColorsPage component, this is where user lands after selecting Colors on Navbar
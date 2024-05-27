// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

// Functional component for the CategoriesPage
const CategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the categories connected to the store id in descending order with the billboards being included
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the category column data structure to match the data table settings
    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <CategoryClient data={formattedCategories}/> {/* Rendering the CategoryClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default CategoriesPage; // Exporting CategoriesPage component, this is where user lands after selecting Billboards on Navbar
// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

// Functional component for the ProductsPage
const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the Products connected to the store id in descending order
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the Products column data structure to match the data table settings
    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <ProductClient data={formattedProducts}/> {/* Rendering the ProductClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default ProductsPage; // Exporting ProductsPage component, this is where user lands after selecting Products on Navbar
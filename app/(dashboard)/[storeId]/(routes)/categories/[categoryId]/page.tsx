import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

// This is where you land after you select add new category or try to edit a category
const CategoryPage = async ({
    params
}: {
    params: { categoryId: string, storeId: string } // Expecting categoryId parameter in params object
}) => {
    // Fetching category data from the database using prismadb
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId // Finding category by its ID
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId // Finding category by its ID
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                billboards={billboards}
                initialData={category}
                /> {/* Rendering the categoryForm component with initialData, if initial data provided takes to edit category or create new if initial data not provided */}
            </div>
        </div>
    );
}

export default CategoryPage; // Exporting categoryPage component
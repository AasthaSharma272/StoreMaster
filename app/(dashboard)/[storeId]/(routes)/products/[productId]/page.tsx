import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

// This is where you land after you select add new Product or try to edit a Product
const ProductPage = async ({
    params
}: {
    params: { productId: string, storeId: string } // Expecting ProductId parameter in params object
}) => {
    // Fetching Product data from the database using prismadb
    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId // Finding Product by its ID
        },
        include: {
            images: true
        }
    });

    // getting all categories in the store
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    // getting all sizes in the store
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    // getting all colors in the store
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    // rendering the form component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm initialData={product}
                categories={categories}
                sizes={sizes}
                colors={colors}
                /> {/* Rendering the ProductForm component with initialData, if initial data provided takes to edit Product or create new if initial data not provided */}
            </div>
        </div>
    );
}

export default ProductPage; // Exporting ProductPage component
"use client";

// import statements
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// interface for the data to be displayed in the data table for Products
interface ProductClientProps{
    data: ProductColumn[]
}

// Component for managing Products in the Products main page
export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    return (
        <>
        {/* Container for the heading and add button */}
            <div className="flex items-center justify-between">
                 {/* Heading for the Products section */}
                <Heading title={`Products (${data.length})`}
                description="Manage products for your store"
                />
                {/* Button to add a new Product, takes you to Products/new or would take you to the edit page of the Product selected */}
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator /> {/* Separator line */}
            {/* Data table to show all Products */}
            <DataTable searchKey="name" columns={columns} data={data}/>
            {/* Heading for API calls to Product */}
            <Heading title="API" description="API calls for Products"/>
            <Separator />
            {/* API list to handle all possible APIs for product */}
            <ApiList entityName="products" entityIdName="productId"/>
        </>
    );
}
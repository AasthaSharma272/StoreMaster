"use client";

// import statements
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// interface for the data to be displayed in the data table for Categories
interface CategoryClientProps{
    data: CategoryColumn[]
}

// Component for managing Categories in the Categories main page
export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    return (
        <>
        {/* Container for the heading and add button */}
            <div className="flex items-center justify-between">
                 {/* Heading for the Categories section */}
                <Heading title={`Categories (${data.length})`}
                description="Manage categories for your store"
                />
                {/* Button to add a new Category, takes you to Categories/new or would take you to the edit page of the Category selected */}
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator /> {/* Separator line */}
            {/* Data table to show all Categories */}
            <DataTable searchKey="name" columns={columns} data={data}/>
            {/* Heading for API calls to Category */}
            <Heading title="API" description="API calls for Categories"/>
            <Separator />
            {/* API list to handle all possible APIs for Categories */}
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    );
}
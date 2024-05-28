"use client";

// import statements
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// interface for the data to be displayed in the data table for sizes
interface SizesClientProps{
    data: SizeColumn[]
}

// Component for managing sizes in the sizes main page
export const SizesClient: React.FC<SizesClientProps> = ({
    data
}) => {
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    return (
        <>
        {/* Container for the heading and add button */}
            <div className="flex items-center justify-between">
                 {/* Heading for the sizes section */}
                <Heading title={`Sizes (${data.length})`}
                description="Manage sizes for your store"
                />
                {/* Button to add a new size, takes you to sizes/new or would take you to the edit page of the size selected */}
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator /> {/* Separator line */}
            {/* Data table to show all sizes */}
            <DataTable searchKey="name" columns={columns} data={data}/>
            {/* Heading for API calls to size */}
            <Heading title="API" description="API calls for Sizes"/>
            <Separator />
            {/* API list to handle all possible APIs for sizes */}
            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    );
}
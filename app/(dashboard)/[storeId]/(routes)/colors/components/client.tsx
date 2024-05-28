"use client";

// import statements
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// interface for the data to be displayed in the data table for Colors
interface ColorsClientProps{
    data: ColorColumn[]
}

// Component for managing Colors in the Colors main page
export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) => {
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    return (
        <>
        {/* Container for the heading and add button */}
            <div className="flex items-center justify-between">
                 {/* Heading for the Colors section */}
                <Heading title={`Colors (${data.length})`}
                description="Manage colors for your store"
                />
                {/* Button to add a new Color, takes you to Colors/new or would take you to the edit page of the Color selected */}
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator /> {/* Separator line */}
            {/* Data table to show all Colors */}
            <DataTable searchKey="name" columns={columns} data={data}/>
            {/* Heading for API calls to Colors */}
            <Heading title="API" description="API calls for Colors"/>
            <Separator />
            {/* API list to handle all possible APIs for Colors */}
            <ApiList entityName="colors" entityIdName="colorId"/>
        </>
    );
}
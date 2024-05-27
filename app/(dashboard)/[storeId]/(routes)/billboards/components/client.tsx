"use client";

// import statements
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

// interface for the data to be displayed in the data table for billboards
interface BillboardClientProps{
    data: BillboardColumn[]
}

// Component for managing billboards in the billboards main page
export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const params = useParams(); // Get parameters from URL
    const router = useRouter(); // Get router from Next.js

    return (
        <>
        {/* Container for the heading and add button */}
            <div className="flex items-center justify-between">
                 {/* Heading for the billboards section */}
                <Heading title={`Billboards (${data.length})`}
                description="Manage billboards for your store"
                />
                {/* Button to add a new billboard, takes you to billboards/new or would take you to the edit page of the billboard selected */}
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator /> {/* Separator line */}
            {/* Data table to show all billboards */}
            <DataTable searchKey="label" columns={columns} data={data}/>
            {/* Heading for API calls to billboard */}
            <Heading title="API" description="API calls for Billboards"/>
            <Separator />
            {/* API list to handle all possible APIs for billboards */}
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    );
}
"use client";

// import statements
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

// interface for the data to be displayed in the data table for orders
interface OrderClientProps{
    data: OrderColumn[]
}

// Component for managing orders in the orders main page
export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return (
        <>
            {/* Heading for the orders section */}
            <Heading title={`Orders (${data.length})`}
            description="Manage orders for your store"
            />
            <Separator /> {/* Separator line */}
            {/* Data table to show all orders */}
            <DataTable searchKey="products" columns={columns} data={data}/>
        </>
    );
}
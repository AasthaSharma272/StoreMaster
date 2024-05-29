// import statements
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

// Functional component for the OrdersPage
const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // getting all the orders connected to the store id in descending order
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // creating the orders column data structure to match the data table settings
    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }));

    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <OrderClient data={formattedOrders}/> {/* Rendering the OrderClient component which includes the data table so passing in formatted columns page */}
            </div>
        </div>
    );
}

export default OrdersPage; // Exporting OrdersPage component, this is where user lands after selecting Orders on Navbar
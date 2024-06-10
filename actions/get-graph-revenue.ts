import prismadb from "@/lib/prismadb" // Importing the prismadb library for database operations

interface GraphData{
    name: string, // Name of the month
    total: number // Total revenue for the month
}

export const getGraphRevenue = async (storeId: string) => {
    // Fetching paid orders for the specified store from the database
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true // Including associated products for each order item
                }
            }
        }
    });

    // Object to store monthly revenue, where keys represent months and values represent total revenue
    const monthlyRevenue: { [key: number]: number } = {};

    // Calculating revenue for each paid order
    for(const order of paidOrders){
        const month = order.createdAt.getMonth(); // Extracting the month from the order creation date
        let revenueForOrder = 0;

        // Calculating revenue for each order item in the order
        for(const item of order.orderItems){
            revenueForOrder += item.product.price.toNumber(); // Accumulating revenue
        }

        // Adding revenue to the corresponding month in the monthlyRevenue object
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    };

    // Array to store graph data for each month, initialized with default values
    const graphData: GraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 }
    ];

    // Populating graphData array with calculated revenue for each month
    for (const month in monthlyRevenue){
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
}
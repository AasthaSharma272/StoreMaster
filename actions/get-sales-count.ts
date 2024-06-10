import prismadb from "@/lib/prismadb"

/**
 * Retrieves the total number of paid orders for a specific store.
 * @param storeId The ID of the store for which sales count is to be retrieved.
 * @returns The total number of paid orders for the specified store.
 */
export const getSalesCount = async (storeId: string) => {
    const salesCount = await prismadb.order.count({
        where: {
            storeId,
            isPaid: true
        }
    });

    return salesCount;
}
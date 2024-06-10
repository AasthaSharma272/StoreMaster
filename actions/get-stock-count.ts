import prismadb from "@/lib/prismadb"

/**
 * Retrieves the total number of stock items for a specific store.
 * @param storeId The ID of the store for which stock count is to be retrieved.
 * @returns The total number of stock for the specified store.
 */
export const getStockCount = async (storeId: string) => {
    const stockCount = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false
        }
    });

    return stockCount;
}
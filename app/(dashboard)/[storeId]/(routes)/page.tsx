import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

// Define props interface for DashboardPage
interface DashboardPageProps{
    params: { storeId: string }
};

// Fetching necessary data asynchronously
const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    const totalRevenue = await getTotalRevenue(params.storeId); // Fetch total revenue
    const salesCount = await getSalesCount(params.storeId); // Fetch sales count
    const stockCount = await getStockCount(params.storeId); // Fetch stock count
    const graphRevenue = await getGraphRevenue(params.storeId); // Fetch graph revenue

    return(
        <div className="flex-col">
            {/* Dashboard content */}
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Dashboard title and description */}
                <Heading title="Dashboard" description="Overview of your store"/>
                <Separator />
                {/* Cards section for displaying key metrics */}
                <div className="grid gap-4 grid-cols-3">
                    {/* Card for displaying total revenue */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Card for displaying sales count */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Card for displaying stock count */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Products in Stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Card for displaying overview graph */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Pass graph revenue data to the Overview component for visualization */}
                        <Overview data={graphRevenue}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;
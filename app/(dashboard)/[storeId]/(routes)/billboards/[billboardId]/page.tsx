import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

// This is where you land after you select add new billboard or try to edit a billboard
const BillboardPage = async ({
    params
}: {
    params: { billboardId: string } // Expecting billboardId parameter in params object
}) => {
    // Fetching billboard data from the database using prismadb
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId // Finding billboard by its ID
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/> {/* Rendering the BillboardForm component with initialData, if initial data provided takes to edit billboard or create new if initial data not provided */}
            </div>
        </div>
    );
}

export default BillboardPage; // Exporting BillboardPage component
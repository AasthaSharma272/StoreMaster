import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

// This is where you land after you select add new size or try to edit a size
const SizePage = async ({
    params
}: {
    params: { sizeId: string } // Expecting sizeId parameter in params object
}) => {
    // Fetching size data from the database using prismadb
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId // Finding size by its ID
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={size}/> {/* Rendering the SizeForm component with initialData, if initial data provided takes to edit size or create new if initial data not provided */}
            </div>
        </div>
    );
}

export default SizePage; // Exporting SizePage component
import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

// This is where you land after you select add new color or try to edit a color
const ColorPage = async ({
    params
}: {
    params: { colorId: string } // Expecting colorId parameter in params object
}) => {
    // Fetching color data from the database using prismadb
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId // Finding color by its ID
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color}/> {/* Rendering the ColorForm component with initialData, if initial data provided takes to edit color or create new if initial data not provided */}
            </div>
        </div>
    );
}

export default ColorPage; // Exporting ColorPage component
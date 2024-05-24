// import statements
import { BillboardClient } from "./components/client";

// Functional component for the BillboardsPage
const BillboardsPage = () => {
    return (
        <div className="flex-col"> {/* Container for the page */}
            <div className="flex-1 space-y-4 p-8 pt-6"> {/* Container for content */}
                <BillboardClient /> {/* Rendering the BillboardClient component */}
            </div>
        </div>
    );
}

export default BillboardsPage; // Exporting BillboardsPage component, this is where user lands after selecting Billboards on Navbar
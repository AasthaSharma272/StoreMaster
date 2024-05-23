// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PATCH handler function updates the name of store
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string } } // Destructured parameters containing store ID only availble because of request
) {
    try{
        const { userId } = auth(); // Get user ID using Clerk's authentication utility
        const body = await req.json(); // Parse request body JSON

        const { name } = body; // Extract new store name from request body

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing name field error
        if (!name){
            return new NextResponse("Name is required", { status: 400 });
        }

        // Handle missing store ID error
        if(!params.storeId){
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // Update the store with the provided store ID with the new name
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId: userId
            },
            data: {
                name: name
            }
        });

        // Return JSON response with updated store data
        return NextResponse.json(store);

    } catch (error){
        console.log('[STORE_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given store with store id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string } } // Destructured parameters containing store ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing store Id error
        if(!params.storeId){
            return new NextResponse("Store Id is required", { status: 400 });
        }

        // Delete the store with the provided store ID
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // Return JSON response with deleted store data
        return NextResponse.json(store);
        
    } catch (error){
        console.log('[STORE_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}
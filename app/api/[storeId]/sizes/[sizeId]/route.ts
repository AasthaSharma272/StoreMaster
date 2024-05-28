// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get handler function which provides the size instace given the size id
export async function GET(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { sizeId: string } } // Destructured parameters containing size ID
) {
    try{
        // Handle missing size Id error
        if(!params.sizeId){
            return new NextResponse("Size Id is required", { status: 400 });
        }

        // Get the size with the provided size ID
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        // Return JSON response with size data obtained
        return NextResponse.json(size);
        
    } catch (error){
        console.log('[SIZE_GET]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// PATCH handler function updates the name or value of the size
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string, sizeId: string } } // Destructured parameters containing store ID and size ID only availble because of request
) {
    try{
        const { userId } = auth(); // Get user ID using Clerk's authentication utility
        const body = await req.json(); // Parse request body JSON

        const { name, value } = body; // Extract new name and value from request body

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing name field error
        if (!name){
            return new NextResponse("Name is required", { status: 400 });
        }

        // Handle missing value field error
        if (!value){
            return new NextResponse("Value is required", { status: 400 });
        }

        // Handle missing size ID error
        if(!params.sizeId){
            return new NextResponse("Size Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a size for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update the size with the provided size ID with the new name and value
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name: name,
                value: value
            }
        });

        // Return JSON response with updated size data
        return NextResponse.json(size);

    } catch (error){
        console.log('[SIZE_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given size with size id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string, sizeId: string } } // Destructured parameters containing store, size ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing size Id error
        if(!params.sizeId){
            return new NextResponse("Size Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a size for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Delete the size with the provided size ID
        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });

        // Return JSON response with deleted size data
        return NextResponse.json(size);
        
    } catch (error){
        console.log('[SIZE_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}


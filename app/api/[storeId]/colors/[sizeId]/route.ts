// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get handler function which provides the color instace given the color id
export async function GET(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { colorId: string } } // Destructured parameters containing color ID
) {
    try{
        // Handle missing color Id error
        if(!params.colorId){
            return new NextResponse("Color Id is required", { status: 400 });
        }

        // Get the color with the provided color ID
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        // Return JSON response with color data obtained
        return NextResponse.json(color);
        
    } catch (error){
        console.log('[COLOR_GET]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// PATCH handler function updates the name or value of the color
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string, colorId: string } } // Destructured parameters containing store ID and color ID only availble because of request
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

        // Handle missing color ID error
        if(!params.colorId){
            return new NextResponse("Color Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a color for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update the color with the provided color ID with the new name and value
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name: name,
                value: value
            }
        });

        // Return JSON response with updated color data
        return NextResponse.json(color);

    } catch (error){
        console.log('[COLOR_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given color with color id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string, colorId: string } } // Destructured parameters containing store, color ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing color Id error
        if(!params.colorId){
            return new NextResponse("Color Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a color for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Delete the color with the provided color ID
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        // Return JSON response with deleted color data
        return NextResponse.json(color);
        
    } catch (error){
        console.log('[COLOR_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}


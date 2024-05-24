// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get handler function which provides the billboard instace given the billboard id
export async function GET(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { billboardId: string } } // Destructured parameters containing billboard ID
) {
    try{
        // Handle missing billboard Id error
        if(!params.billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 });
        }

        // Get the billboard with the provided billboard ID
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        // Return JSON response with billboard data obtained
        return NextResponse.json(billboard);
        
    } catch (error){
        console.log('[BILLBOARD_GET]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// PATCH handler function updates the image or label of the billboard
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string, billboardId: string } } // Destructured parameters containing store ID and billboard ID only availble because of request
) {
    try{
        const { userId } = auth(); // Get user ID using Clerk's authentication utility
        const body = await req.json(); // Parse request body JSON

        const { label, imageUrl } = body; // Extract new label and imageurl from request body

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing label field error
        if (!label){
            return new NextResponse("Label is required", { status: 400 });
        }

        // Handle missing imageurl field error
        if (!imageUrl){
            return new NextResponse("Image Url is required", { status: 400 });
        }

        // Handle missing billboard ID error
        if(!params.billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 });
        }

        // getting thre store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a billboard for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update the billboard with the provided billboard ID with the new label and image Url
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label: label,
                imageUrl: imageUrl
            }
        });

        // Return JSON response with updated billboard data
        return NextResponse.json(billboard);

    } catch (error){
        console.log('[BILLBOARD_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given billboard with billboard id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string, billboardId: string } } // Destructured parameters containing store, billboard ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing billboard Id error
        if(!params.billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 });
        }

        // getting thre store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a billboard for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Delete the billboard with the provided billboard ID
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        // Return JSON response with deleted billboard data
        return NextResponse.json(billboard);
        
    } catch (error){
        console.log('[BILLBOARD_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}


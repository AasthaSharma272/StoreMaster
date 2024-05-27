// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get handler function which provides the category instace given the category id
export async function GET(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { categoryId: string } } // Destructured parameters containing category ID
) {
    try{
        // Handle missing category Id error
        if(!params.categoryId){
            return new NextResponse("Category Id is required", { status: 400 });
        }

        // Get the category with the provided category ID
        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });

        // Return JSON response with category data obtained
        return NextResponse.json(category);
        
    } catch (error){
        console.log('[CATEGORY_GET]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// PATCH handler function updates the name or billboardId of the category
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string, categoryId: string } } // Destructured parameters containing store ID and category ID only availble because of request
) {
    try{
        const { userId } = auth(); // Get user ID using Clerk's authentication utility
        const body = await req.json(); // Parse request body JSON

        const { name, billboardId } = body; // Extract new name and billboardid from request body

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing name field error
        if (!name){
            return new NextResponse("Name is required", { status: 400 });
        }

        // Handle missing billboardid field error
        if (!billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 });
        }

        // Handle missing category ID error
        if(!params.categoryId){
            return new NextResponse("Category Id is required", { status: 400 });
        }

        // getting thre store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a category for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update the category with the provided category ID with the new name and billboard id
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name: name,
                billboardId: billboardId
            }
        });

        // Return JSON response with updated category data
        return NextResponse.json(category);

    } catch (error){
        console.log('[CATEGORY_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given category with category id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string, categoryId: string } } // Destructured parameters containing store, category ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing category Id error
        if(!params.categoryId){
            return new NextResponse("Category Id is required", { status: 400 });
        }

        // getting thre store given by the store id and user id
        const storebyUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        });

        // if store id with user id not given, not allowed to create a category for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Delete the category with the provided category ID
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        // Return JSON response with deleted category data
        return NextResponse.json(category);
        
    } catch (error){
        console.log('[CATEGORY_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}


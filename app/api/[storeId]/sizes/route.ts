import { NextResponse } from "next/server"; // Importing NextResponse from next/server package
import { auth } from '@clerk/nextjs/server'; // Importing auth function from @clerk/nextjs/server package
import prismadb from "@/lib/prismadb"; // Importing prismadb instance

// Post function call to upload a new size
export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
)
{
    try{
        // Extracting userId from authenticated session
        const { userId } = auth();

        // Parsing JSON body of the request
        const body = await req.json();
        const { name, value } = body;

        // Checking if userId is present, indicating authentication
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Checking if name is provided in the request body
        if(!name){
            return new NextResponse("Name is Required", { status: 400 });
        }

        // Checking if value is provided in the request body
        if(!value){
            return new NextResponse("Value is Required", { status: 400 });
        }

        // checking if storeId in params is provided
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
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
        
        // Creating a new size in the database with provided name and value and storeId
        const size = await prismadb.size.create({
            data: {
                name: name,
                value: value,
                storeId: params.storeId
            }
        });

        // Returning the created size as JSON response
        return NextResponse.json(size);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[SIZE_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Get function to get all the sizes created in that particular store 
export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
)
{
    try{
        // checking if storeId in params is provided
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }
        
        //Getting all sizes in the database with provided storeId
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        // Returning the sizes as JSON response
        return NextResponse.json(sizes);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
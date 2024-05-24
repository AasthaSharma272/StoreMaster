import { NextResponse } from "next/server"; // Importing NextResponse from next/server package
import { auth } from '@clerk/nextjs/server'; // Importing auth function from @clerk/nextjs/server package
import prismadb from "@/lib/prismadb"; // Importing prismadb instance

// Post function call to upload a new billboard
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
        const { label, imageUrl } = body;

        // Checking if userId is present, indicating authentication
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Checking if label is provided in the request body
        if(!label){
            return new NextResponse("Label is Required", { status: 400 });
        }

        // Checking if image url is provided in the request body
        if(!imageUrl){
            return new NextResponse("Image Url is Required", { status: 400 });
        }

        // checking if storeId in params is provided
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
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
        
        // Creating a new billboard in the database with provided label and imageUrl and storeId
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        // Returning the created billboard as JSON response
        return NextResponse.json(billboard);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Get function to get all the billboards created in that particular store 
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
        
        //Getting all billboards in the database with provided storeId
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        // Returning the billboards as JSON response
        return NextResponse.json(billboards);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
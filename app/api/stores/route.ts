import { NextResponse } from "next/server"; // Importing NextResponse from next/server package
import { auth } from '@clerk/nextjs/server'; // Importing auth function from @clerk/nextjs/server package
import prismadb from "@/lib/prismadb"; // Importing prismadb instance

export async function POST(
    req: Request,
)
{
    try{
        // Extracting userId from authenticated session
        const { userId } = auth();

        // Parsing JSON body of the request
        const body = await req.json();
        const { name } = body;

        // Checking if userId is present, indicating authentication
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Checking if name is provided in the request body
        if(!name){
            return new NextResponse("Name is Required", { status: 400 });
        }

        // Creating a new store in the database with provided name and userId
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        // Returning the created store as JSON response
        return NextResponse.json(store);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
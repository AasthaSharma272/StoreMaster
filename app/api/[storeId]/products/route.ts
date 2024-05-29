import { NextResponse } from "next/server"; // Importing NextResponse from next/server package
import { auth } from '@clerk/nextjs/server'; // Importing auth function from @clerk/nextjs/server package
import prismadb from "@/lib/prismadb"; // Importing prismadb instance

// Post function call to upload a new product
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
        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body;

        // Checking if userId is present, indicating authentication
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Checking if name is provided in the request body
        if(!name){
            return new NextResponse("Name is Required", { status: 400 });
        }

        // Checking if image is provided in the request body
        if(!images || !images.length){
            return new NextResponse("Images are Required", { status: 400 });
        }

        // Checking if price is provided in the request body
        if(!price){
            return new NextResponse("Price is Required", { status: 400 });
        }

        // Checking if category id is provided in the request body
        if(!categoryId){
            return new NextResponse("Category Id is Required", { status: 400 });
        }

        // Checking if size id is provided in the request body
        if(!sizeId){
            return new NextResponse("Size Id is Required", { status: 400 });
        }

        // Checking if color id is provided in the request body
        if(!colorId){
            return new NextResponse("Color Id is Required", { status: 400 });
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

        // if store id with user id not given, not allowed to create a product for that store
        if(!storebyUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }
        
        // Creating a new product in the database with provided information
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        // Returning the created product as JSON response
        return NextResponse.json(product);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Get function to get all the products created in that particular store 
export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
)
{
    try{
        // getting all filters to search by products with filters, if not given then undefined to include all products
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        // checking if storeId in params is provided
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }
        
        //Getting all products in the database with provided storeId, also filtered by different aspects
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Returning the products as JSON response
        return NextResponse.json(products);
        
    } catch (error){
        // Logging and returning internal server error if any exception occurs
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
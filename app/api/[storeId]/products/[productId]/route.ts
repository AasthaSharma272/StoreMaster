// Import statements
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get handler function which provides the product instace given the product id
export async function GET(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { productId: string } } // Destructured parameters containing product ID
) {
    try{
        // Handle missing product Id error
        if(!params.productId){
            return new NextResponse("Product Id is required", { status: 400 });
        }

        // Get the product with the provided product ID
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            }
        });

        // Return JSON response with product data obtained
        return NextResponse.json(product);
        
    } catch (error){
        console.log('[PRODUCT_GET]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// PATCH handler function updates the info of the product
export async function PATCH(
    req: Request, // Incoming HTTP request
    { params }: { params: { storeId: string, productId: string } } // Destructured parameters containing store ID and product ID only availble because of request
) {
    try{
        const { userId } = auth(); // Get user ID using Clerk's authentication utility
        const body = await req.json(); // Parse request body JSON

        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body; // Extract new info from request body

        // Handle authentication errors
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

        // Handle missing product ID error
        if(!params.productId){
            return new NextResponse("Product Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
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

        // Update the product with the provided product ID with the info, first delete all images and update other info, then update the images in a constant product
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {

                    }
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        // Return JSON response with updated product data
        return NextResponse.json(product);

    } catch (error){
        console.log('[PRODUCT_PATCH]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}

// DELETE handler function which deletes the given product with product id
export async function DELETE(
    _req: Request, // incoming HTTP request, not used in the function
    { params }: { params: { storeId: string, productId: string } } // Destructured parameters containing store, PRODUCT ID
) {
    try{
        // Get user ID using Clerk's authentication utility
        const { userId } = auth();

        // Handle authentication errors
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Handle missing product Id error
        if(!params.productId){
            return new NextResponse("Product Id is required", { status: 400 });
        }

        // getting the store given by the store id and user id
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

        // Delete the product with the provided product ID
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        // Return JSON response with deleted product data
        return NextResponse.json(product);
        
    } catch (error){
        console.log('[PRODUCT_DELETE]', error); // Log any errors
        return new NextResponse("Internal error", { status: 500 }); // Return internal error response
    }
}


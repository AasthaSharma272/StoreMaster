import Stripe from "stripe";

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

// CORS headers for enabling cross-origin resource sharing
const corsHeader = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// OPTIONS method for handling preflight requests
export async function OPTIONS(){
    // Respond with an empty JSON object and CORS headers
    return NextResponse.json({}, { headers: corsHeader });
}

// POST method for creating orders
export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){
    // Extracting productIds from the request body
    const { productIds } = await req.json();
    
    // Check if productIds are provided and non-empty
    if(!productIds || productIds.length === 0){
        return new NextResponse("Product ids are required", { status: 400 });
    }

    // Fetching products from the database based on provided productIds
    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    // Initializing an array to store line items for Stripe checkout session
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Iterating over fetched products to create line items for the checkout session
    products.forEach((product) => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price.toNumber()
            }
        });
    });

    // Creating an order in the database with associated order items
    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            }
        }
    });

    // Creating a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`, // Redirect URL on successful payment
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`, // Redirect URL on canceled payment
        metadata: {
            orderId: order.id
        }
    });

    // Return the checkout session URL as JSON response
    return NextResponse.json({ url: session.url }, {
        headers: corsHeader
    });
}
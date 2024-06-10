import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Handler for POST requests to webhook endpoint
export async function POST(req: Request){
    const body = await req.text();
    // Extracting request body and Stripe signature from headers
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try{
        // Verifying and parsing the incoming webhook event
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any){
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    // Extracting address details from the webhook event
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    // Constructing the address string from address components
    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];
    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    // Handling the checkout.session.completed event
    if(event.type === "checkout.session.completed"){
        const order = await prismadb.order.update({
            // Updating the order status to paid and storing the address and phone number
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems: true,
            }
        });

        // Extracting productIds from order items
        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        // Archiving the purchased products
        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds]
                }
            },
            data: {
                isArchived: true
            }
        });
    }

    // Returning a success response with status code 200
    return new NextResponse(null, { status: 200 });
}
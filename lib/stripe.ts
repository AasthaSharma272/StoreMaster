import Stripe from "stripe";

// creating a stripe endpoint for checkout capabilities
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-04-10", 
    typescript: true
});
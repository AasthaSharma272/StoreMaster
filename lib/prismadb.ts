import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the PrismaClient instance.
declare global {
    var prisma: PrismaClient | undefined
};

// Create a PrismaClient instance if it doesn't already exist in the global context.
const prismadb = globalThis.prisma || new PrismaClient();

// If we are in development environment, assign the PrismaClient instance to the global variable.
if(process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;


export default prismadb; // Exporting the PrismaClient instance.
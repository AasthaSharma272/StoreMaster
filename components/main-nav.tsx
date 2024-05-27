"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";


/**
 * Main navigation component.
 * Renders navigation links based on the current pathname and store ID.
 * @param className - Additional CSS classes for styling.
 * @param props - Additional HTML attributes.
 * @returns MainNav component.
 */
export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>){
    // Get the current pathname and store ID using next/navigation hooks
    const pathname = usePathname();
    const params = useParams();
    
    // Define navigation routes ahead like settings, overview based on the current store ID
    // Routes so far: Overview, Billboards, Settings
    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            // Determine if the route is active based on the current pathname
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            // Determine if the route is active based on the current pathname
            active: pathname === `/${params.storeId}/billboards`,
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            // Determine if the route is active based on the current pathname
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            // Determine if the route is active based on the current pathname
            active: pathname === `/${params.storeId}/settings`,
        }
    ];

    return(
        // Render navigation links
        <nav
        className={cn("flex items-centered space-x-4 lg:sace-x-6", className)}
        >
            {routes.map((route) => (
                // Render each navigation link as a Next.js Link component
                <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-black dark:text-white" : "text-muted-foregrund"
                )}
                >
                    {/* Display the label of the navigation link */}
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}
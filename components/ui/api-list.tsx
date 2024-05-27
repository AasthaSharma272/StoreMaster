"use client";

// import statements
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { APiAlert } from "@/components/ui/api-alert";

// things used to describe the API used in the showing the API routes on different pages
interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {
    // getting the storeId from params and url from origin
    const params = useParams();
    const origin = useOrigin();

    // baseurl for all api routes created
    const baseUrl = `${origin}/api/${params.storeId}`;

    // creating multiple API Alerts to showcase the multiple API routes created
    return (
        <>
            <APiAlert 
            title="GET"
            variant="public"
            description={`${baseUrl}/${entityName}`}
            />
            <APiAlert 
            title="GET"
            variant="public"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <APiAlert 
            title="POST"
            variant="admin"
            description={`${baseUrl}/${entityName}`}
            />
            <APiAlert 
            title="PATCH"
            variant="admin"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <APiAlert 
            title="DELETE"
            variant="admin"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </>
    );
}
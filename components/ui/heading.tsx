// Define props for the Heading component
interface HeadingProps {
    title: string; // Title of the heading
    description: string; // Description or subtitle of the heading
}

// Heading component
export const Heading: React.FC<HeadingProps> = ({
    title,
    description
}) => {
    return (
        <div>
            {/* Render the title with specific styling */}
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {/* Render the description with specific styling */}
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

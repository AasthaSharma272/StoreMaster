"use client";

// import statements
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

// Interface for props passed to ImageUpload component
interface ImageUploadProps{
    disabled?: boolean, // Optional boolean flag to disable component
    onChange: (Value: string) => void, // Function to handle change event
    onRemove: (Value: string) => void, // Function to handle remove event
    value: string[]; // Array of URLs for images
}

// Functional component for uploading images
const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false); // State to track whether the component is mounted.

    useEffect(() => {
        setIsMounted(true); // Setting isMounted to true when the component is mounted.
    }, []);
    
    // Function to handle successful image upload
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    // If the component is not yet mounted, return null. Helps in the server side
    if(!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {/* Map through array of image URLs and render each image */}
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            {/* Button to remove image */}
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* Display image */}
                        <Image 
                        fill
                        className="object-cover"
                        alt="Image"
                        src={url}
                        />
                    </div>
                ))}
            </div>
            {/* Cloudinary Upload Widget */}
            <CldUploadWidget onSuccess={onUpload} uploadPreset="q1vzhdrf">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    {/* Upload an image using Cloudinary Widget */}
                    return (
                        <Button
                        type="button"
                        disabled={disabled}
                        variant="secondary"
                        onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2"/>
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload; // Exporting ImageUpload component
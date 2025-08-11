"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";

interface fileUploadProps {
    onSuccess: (res: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video" ;
}


const FileUpload = ({onSuccess,onProgress,fileType}: fileUploadProps) => {
    
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    //option validation
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please Upload A Valid Video File")
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File Size Must Be Less Than 100MB")
        }

        return true
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")

            const auth = await authRes.json()


            const res = await upload({
                file,
                fileName: file.name, // Optionally set a custom file name
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))

                    }
                },
            });

            onSuccess(res)

        } catch (error) {
            if (error instanceof ImageKitUploadNetworkError) {
                setError("Network Error. Please try again.")
            }
        }finally{
            setUploading(false)
        }

    }

    return (
        <>
            <input type="text" accept={fileType === "video" ? "video/*" : "image/*"} onChange={handleFileChange}/>
            {uploading && (
                <span>Loading...</span>
            )}
        </>
    );
};

export default FileUpload;
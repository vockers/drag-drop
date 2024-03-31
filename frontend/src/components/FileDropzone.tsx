import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles[0].name)
    }, [])
    const { getRootProps, getInputProps } = useDropzone({onDrop})

    return (
        <div {...getRootProps()} className="flex flex-col items-center justify-center aspect-square outline-dashed opacity-40 outline-slate-600">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    )
}
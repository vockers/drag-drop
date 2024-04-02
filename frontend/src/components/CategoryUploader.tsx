import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Ajv from "ajv";
import TreeNode from "./TreeNode";
import axios from "axios";
import { categorySchema } from "../config";

export default function CategoryUploader() {
    const [category, setCategory] = useState({})
    const [uploaded, setUploaded] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles[0].text().then((text) => {
            const category = JSON.parse(text);
            const ajv = new Ajv();
            const validate = ajv.compile(categorySchema)
            const valid = validate(category)
            if (!valid) console.log(validate.errors)
            else setCategory(category)
        })
    }, [])
    const { isDragAccept, getRootProps, getInputProps } = useDropzone({onDrop, multiple: false, accept: {"application/json": [".json"]}})

    const handleUpload = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/categories`, category).then((_) => {
            setUploaded(true);
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleCancel = () => {
        setCategory({});
    }

    return (
        <>
            {uploaded ? (
                <div className="flex w-full aspect-square flex-col items-center justify-center gap-5">
                    <i className="fa fa-check text-7xl text-slate-600"></i>
                    <h1 className="text-xl">Successfully uploaded categories!</h1>
                </div>
            ) : (
                category.hasOwnProperty('name') ? (
                    <div className="w-full aspect-square flex flex-col justify-between">
                        <div className="grow bg-slate-200 p-3 rounded-md">
                            <TreeNode node={category} showChildrenNow={true} />
                        </div>
                        <div className="flex justify-center gap-3 mt-6">
                            <button onClick={handleUpload} className="px-3 py-2 rounded-md bg-blue-500 text-slate-100 flex gap-2">
                                <i className="fa fa-circle-arrow-up self-center"></i>
                                <span className="font-medium">UPLOAD</span>
                            </button>
                            <button onClick={handleCancel} className="px-3 py-2 rounded-md bg-red-500 text-slate-100 flex gap-2">
                                <i className="fa fa-circle-arrow-up self-center"></i>
                                <span className="font-medium">CANCEL</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div {...getRootProps({isDragAccept})} className={"flex flex-col items-center justify-center w-full aspect-square rounded-sm border-4 border-dashed border-opacity-40 border-slate-600 text-slate-500 hover:cursor-pointer " + (isDragAccept && "bg-slate-200")}>
                        <div className={isDragAccept ? "test" : "hello"}></div>
                        <input {...getInputProps()} />
                        <i className="fa fa-file-code text-8xl mb-12"></i>
                        <p className="text-xl font-medium">Drag 'n' drop a .json file, or click to select a file.</p>
                    </div>
                )
            )}
        </>
    );
}

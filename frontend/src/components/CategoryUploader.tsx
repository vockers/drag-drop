import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import Ajv from "ajv";
import axios from "axios";
import { categorySchema } from "../config";
import { AuthenticationContext } from "@/context/AuthContext";
import { Alert } from "@mui/material";

export default function CategoryUploader() {
    const [category, setCategory] = useState({})
    const [uploaded, setUploaded] = useState(false)
    const [error, setError] = useState("")
    const { user } = useContext(AuthenticationContext);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError("");
        acceptedFiles[0].text().then((text) => {
            const category = JSON.parse(text);
            const ajv = new Ajv();
            const validate = ajv.compile(categorySchema)
            const valid = validate(category)
            if (!valid) {
                setError(validate.errors?.[0]?.message || "Invalid JSON file");
            }
            else setCategory(category)
        })
    }, [])
    const { isDragAccept, getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: { "application/json": [".json"] } })

    const handleUpload = () => {
        axios.post(
            `${import.meta.env.VITE_API_URL}/categories`,
            category,
            { headers: { Authorization: `Bearer ${user?.token}` } }
        )
        .then((_) => {
            setUploaded(true);
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="relative w-full max-w-screen-md mb-5 rounded bg-white shadow-md p-6">
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
                            <button onClick={() => setCategory({})} className="px-3 py-2 rounded-md bg-red-500 text-slate-100 flex gap-2">
                                <i className="fa fa-circle-arrow-up self-center"></i>
                                <span className="font-medium">CANCEL</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div {...getRootProps({ isDragAccept })} className={"flex flex-col items-center justify-center w-full aspect-square rounded-sm border-4 border-dashed border-opacity-40 border-slate-600 text-slate-500 hover:cursor-pointer " + (isDragAccept && "bg-slate-200")}>
                        <input {...getInputProps()} />
                        <i className="fa fa-file-code text-8xl mb-10"></i>
                        <p className="text-xl font-medium mb-8">Drag 'n' drop a .json file, or click to select a file.</p>
                        {error ? <Alert severity="error" className="mb-4">{error}</Alert> : ""}
                    </div>
                )
            )}
            {!user &&
                <div className="absolute h-full w-full top-0 left-0 rounded bg-black bg-opacity-60 flex flex-col justify-center items-center">
                    <h1 className="bg-slate-900 opacity-65 w-full p-5 text-center text-slate-50 text-1xl font-semibold uppercase">Please login or sign up</h1>
                </div>
            }
        </div>
    );
}

function TreeNode({ node, showChildrenNow }: { node: any, showChildrenNow: boolean }) {
    const [showChildren, setShowChildren] = useState(showChildrenNow);
    const hasChildren = node.hasOwnProperty("children");

    const handleClick = () => {
        setShowChildren(!showChildren);
    }

    return (
        <div className="text-slate-600 w-full">
            <button onClick={handleClick} className={"w-full px-3 py-2 flex gap-2 mb-1 rounded-md hover:bg-slate-300 " + (showChildren && "bg-slate-300")}>
                {hasChildren ? (
                    showChildren ? (
                        <i className="w-4 fa fa-chevron-down self-center text-xs"></i>
                    ) : (
                        <i className="w-4 fa fa-chevron-right self-center text-xs"></i>
                    )
                ) : (
                    <div className="pl-4"></div>
                )}
                <h1>{node.name}</h1>
            </button>
            {hasChildren && showChildren &&
                <div className="pl-3">
                    {node.children.map((child: any) => {
                        return (
                            <TreeNode node={child} key={child.name} showChildrenNow={false} />
                        )
                    })}
                </div>
            }
        </div>
    )
}
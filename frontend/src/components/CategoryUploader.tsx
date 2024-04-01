import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Ajv from "ajv";
import TreeNode from "./TreeNode";

const categorySchema = {
    "$id": "/Category",
    "type": "object",
    "maxProperties": 2,
    "required": ["name"],
    "additionalProperties": false,
    "properties": {
        "name": {"type": "string", "minLength": 3, "maxLength": 64},
        "children": {
            "type": "array",
            "items": {"$ref": "/Category"},
            "minItems": 1,
        }
    },
};

export default function CategoryUploader() {
    const [category, setCategory] = useState({})

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

        const isDragAcceptStyle = isDragAccept ? "bg-slate-200" : "";

        return (
            <>
                {category.hasOwnProperty('name') ? (
                    <div className="h-full w-full bg-slate-300 p-3 rounded-md">
                        <TreeNode node={category} showChildrenNow={true} />
                    </div>
                ) : (
                    <div {...getRootProps({isDragAccept})} className={"flex flex-col items-center justify-center aspect-square rounded-sm border-4 border-dashed border-opacity-40 border-slate-600 text-slate-500 hover:cursor-pointer " + isDragAcceptStyle}>
                        <div className={isDragAccept ? "test" : "hello"}></div>
                        <input {...getInputProps()} />
                        <i className="fa fa-file-code text-8xl mb-12"></i>
                        <p className="text-xl font-medium">Drag 'n' drop a .json file, or click to select a file.</p>
                    </div>
                )}
            </>
        );
    }

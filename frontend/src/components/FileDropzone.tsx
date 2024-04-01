import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Ajv from "ajv";

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

export default function() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles[0].text().then((text) => {
            const category = JSON.parse(text);
            const ajv = new Ajv();
            const validate = ajv.compile(categorySchema)
            const valid = validate(category)
            if (!valid) console.log(validate.errors)
            else console.log("Valid JSON")
        })
    }, [])
    const { isDragAccept, getRootProps, getInputProps } = useDropzone({onDrop, multiple: false, accept: {"application/json": [".json"]}})

    const isDragAcceptStyle = isDragAccept ? "bg-slate-200" : ""

    return (
        <div {...getRootProps({isDragAccept})} className={"flex flex-col items-center justify-center aspect-square rounded-sm border-4 border-dashed border-opacity-40 border-slate-600 text-slate-500 " + isDragAcceptStyle}>
            <div className={isDragAccept ? "test" : "hello"}></div>
            <input {...getInputProps()} />
            <i className="fa fa-file-code text-8xl mb-12"></i>
            <p className="text-xl font-medium">Drag 'n' drop a .json file, or click to select a file.</p>
        </div>
    )
}
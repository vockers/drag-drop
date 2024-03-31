import FileDropzone from "../components/FileDropzone";

export default function Home() {
    return (
        <>
            <div className="w-full h-full max-w-screen-md mb-5 rounded-md bg-white shadow-md p-8">
                <FileDropzone />
            </div>
        </>
    )
}
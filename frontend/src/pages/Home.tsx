import CategoryUploader from "../components/CategoryUploader";

export default function Home() {
    return (
        <>
            <div className="w-full max-w-screen-md mb-5 rounded-md bg-white shadow-md p-6">
                <CategoryUploader />
            </div>
        </>
    )
}
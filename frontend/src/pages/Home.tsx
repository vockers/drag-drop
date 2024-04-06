import { useContext } from "react";
import CategoryUploader from "@/components/CategoryUploader";
import CategoryList from "@/components/CategoryList";
import { AuthenticationContext } from "@/context/AuthContext";

export default function Home() {
    const { user } = useContext(AuthenticationContext);
    return (
        <>
        <div className="w-full max-w-screen-md mb-5 rounded-md bg-white shadow-md p-6">
            {user ? (
                <CategoryUploader />
            ) : (
                <div className="text-center uppercase font-semibold text-slate-700">
                    <h1>Please login to Upload a category</h1>
                </div>
            )}
        </div>
        <CategoryList />
        </>
    )
}
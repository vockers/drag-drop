import { AuthenticationContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext, useState } from "react";
import CategoryModal from "./CategoryModal";

export default function CategoryListItem({ category }: { category: any }) {
    const [deleted, setDeleted] = useState(false);
    const { user } = useContext(AuthenticationContext);

    const deleteCategory = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/categories/${category.id}`,
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            setDeleted(true);
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div
            style={{ display: deleted ? "none" : "flex" }}
            className="w-full max-w-screen-md mb-5 rounded-md bg-white shadow-md p-6 justify-between items-center"
        >
            <h2 className="text-slate-600 font-semibold text-lg">{category.name}</h2>
            <div className="flex gap-2">
                {category.user_id === user?.id && (
                    <button onClick={deleteCategory} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-slate-50 font-medium">DELETE</button>
                )}
                <CategoryModal category={category} />
            </div>
        </div>
    );
}
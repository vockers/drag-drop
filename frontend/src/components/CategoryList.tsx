import axios from "axios"
import { useEffect, useState } from "react"

const fetchAllCategories = async () => {
}
export default function CategoryList() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_API_URL}/categories`).then((response) => {
                return response.data
            }).then((data) => {
                setCategories(data);
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <>
            { categories.map((category: any) => (
                <div className="w-full max-w-screen-md mb-5 rounded-md bg-white shadow-md p-6 flex justify-between">
                    <h2>{category.name}</h2>
                    <button className="text-blue-500 font-semibold">SHOW</button>
                </div>)
            ) }
        </>
    )
}
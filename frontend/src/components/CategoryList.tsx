import axios from "axios"
import { useEffect, useState } from "react"
import CategoryListItem from "./CategoryListItem";

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
            {categories.map((category: any, index) => (
                <CategoryListItem key={index} category={category} />
            )
            )}
        </>
    )
}
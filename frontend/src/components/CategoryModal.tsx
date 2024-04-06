import { Box, CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 3,
    p: 4,
    borderRadius: "4px",
};

export default function CategoryModal({ category_id }: { category_id: number }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState({})

    const toggleModal = () => setOpen(!open);

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_API_URL}/categories/${category_id}`).then((response) => {
                return response.data
            }).then((data) => {
                setLoading(false);
                setCategory(data);
            })
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }, [])

    return (
        <>
            <button onClick={toggleModal} className="text-blue-500 font-semibold">SHOW</button>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="h-[500px]">
                        {loading ? (
                            <div className="py-24 px-2 h-full flex justify-center items-center">
                                <CircularProgress />
                            </div>
                        ) : (
                            <TreeNode node={category} />
                        )}
                    </div>
                </Box>
            </Modal>
        </>
    )
}

function TreeNode({node}: {node: any}) {
    const [showChildren, setShowChildren] = useState(true);
    const [children, setChildren] = useState([]);

    const fetchChildren = () => {
        try {
            axios.get(`${import.meta.env.VITE_API_URL}/categories/${node.id}`).then((response) => {
                return response.data
            }).then((data) => {
                setChildren(data.children);
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchChildren(); 
    }, [])

    const handleClick = () => {
        setShowChildren(!showChildren);
    }

    return (
        <div className="text-slate-600 w-full">
            <button onClick={handleClick} className={"w-full px-3 py-2 flex gap-2 mb-1 rounded-md hover:bg-slate-300 " + (showChildren && "bg-slate-300")}>
                {children.length > 0 ? (
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
            {children.length > 0 &&
                <div className="pl-3" style={{display: showChildren ? "block" : "none"}}>
                    {children.map((child: any, index) => {
                        return (
                            <TreeNode node={child} key={index} />
                        )
                    })}
                </div>
            }
        </div>
    )
}
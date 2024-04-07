import { AuthenticationContext } from "@/context/AuthContext";
import { Box, CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react"

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

export default function CategoryModal({ category }: { category: any }) {
    const [open, setOpen] = useState(false)
    
    const { user } = useContext(AuthenticationContext);

    const toggleModal = () => setOpen(!open);

    return (
        <>
            <div className="flex gap-2">
                { category.user_id === user?.id && (
                    <button onClick={toggleModal} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-slate-50 font-medium">DELETE</button>
                )}
                <button onClick={toggleModal} className="px-3 py-1 border-2 rounded hover:bg-slate-200 border-blue-500 text-blue-600 font-medium">SHOW</button>
            </div>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="h-[500px]">
                        <div className="h-full grow bg-slate-200 p-3 rounded-md">
                            <TreeNode node={category} />
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

function TreeNode({node}: {node: any}) {
    const [showChildren, setShowChildren] = useState(true);
    const [children, setChildren] = useState([]);

    useEffect(() => {
        try {
            axios.get(`${import.meta.env.VITE_API_URL}/categories/${node.id}`).then((response) => {
                return response.data
            }).then((data) => {
                setChildren(data.children);
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleClick = () => {
        setShowChildren(!showChildren);
    }

    return (
        <div className="text-slate-600 w-full">
            <button onClick={handleClick} className={"w-full px-3 py-2 flex gap-2 mb-1 rounded-md hover:bg-slate-300 " + (children.length > 0 && showChildren && "bg-slate-300")}>
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
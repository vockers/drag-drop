import { AuthenticationContext } from "@/context/AuthContext";
import useAuth from "@/hooks/useAuth";
import { Alert, Box, CircularProgress, Modal } from "@mui/material";
import { useContext, useEffect, useState } from "react";

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

export default function SignupModal() {
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [disabled, setDisabled] = useState(true);
    const { signup } = useAuth();
    const { loading, error } = useContext(AuthenticationContext);

    const toggleModal = () => setOpen(!open);

    useEffect(() => {
        setDisabled(!(inputs.username && inputs.password && inputs.confirmPassword));
    }, [inputs])

    const handleClick = () => {
        signup({ username: inputs.username, password: inputs.password });
    }

    return (
        <div>
            <button onClick={toggleModal} className="h-full px-3 rounded bg-blue-500 hover:bg-blue-600 text-slate-50 font-medium">SIGN UP</button>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="h-[500px]">
                        {loading ?
                            <div className="py-24 px-2 h-full flex justify-center items-center">
                                <CircularProgress />
                            </div>
                            :
                            <div className="p-2 text-slate-700 flex-col justify-center">
                                <div className="uppercase font-bold text-center pb-2 my-10">
                                    <p className="text-xl">
                                        Sign Up
                                    </p>
                                </div>
                                {error ? <Alert severity="error" className="mb-4">{error}</Alert> : ""}
                                <div className="m-auto">
                                    <div className="my-5 flex justify-between">
                                        <input type="text" className="border rounded p-2 py-3 w-full" placeholder="Username" value={inputs.username} onChange={e => setInputs({ ...inputs, username: e.target.value })} />
                                    </div>
                                    <div className="my-5 flex justify-between">
                                        <input type="password" className="border rounded p-2 py-3 w-full" placeholder="Password" value={inputs.password} onChange={e => setInputs({ ...inputs, password: e.target.value })} />
                                    </div>
                                    <div className="my-5 flex justify-between">
                                        <input type="password" className="border rounded p-2 py-3 w-full" placeholder="Confirm password" value={inputs.confirmPassword} onChange={e => setInputs({ ...inputs, confirmPassword: e.target.value })} />
                                    </div>
                                    <button onClick={handleClick} className="uppercase bg-blue-500 w-full text-white p-3 rounded mb-5 text-lg disabled:bg-gray-400" disabled={disabled}>
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
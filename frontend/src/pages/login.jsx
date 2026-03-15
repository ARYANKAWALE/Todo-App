import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registerBg from '../assets/images/registerbg.png'

const Login = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [message, setMessage] = useState("");

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting:", data);
        try {
            const response = await axios.post(
                "/api/v4/users/login",
                data,
                {
                    withCredentials: true
                }
            );
            console.log("Login Success:", response.data);
            showToast("Login Successful! 🎉");
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error);
            if (error.response?.status === 404 || error.response?.status === 401) {
                setMessage("User does not exist or incorrect password", "danger");
                setTimeout(() => navigate("/register"), 2000)
            }
            else if (error.response?.data?.message) {
                setMessage(error.response.data.message, "danger");
            }
            else {
                showToast("Login failed", "danger");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fafafa] text-white">
            <img src={registerBg} alt="" className='absolute top-0 left-0 w-full h-full object-cover -z-0' />
            {toast.show && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
                    <div className={`toast show align-items-center text-white bg-${toast.type} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                {toast.message}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto"
                                onClick={() => setToast({ ...toast, show: false })} aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 border border-gray-700 rounded-lg min-w-[400px] bg-[#ffffffaa] relative z-10"
            >
                <h1 className="text-2xl font-bold mb-4 text-black text-center">Login</h1>
                <div className="flex flex-col gap-2 text-black">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={data.username}
                        onChange={handleChange}
                        className="p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="Enter username"
                    />
                </div>
                <div className="flex flex-col gap-2 text-black">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={data.password}
                        onChange={handleChange}
                        className="p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="Enter password"
                    />
                    <p className="text-red-500 text-sm">{message}</p>
                </div>
                <button
                    type="submit"
                    className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors hover:shadow-md">
                    Submit
                </button>
                <div className="flex justify-center text-black">
                    <p>Don't have an Account?<Link to="/register" className="text-blue-500 hover:underline no-underline">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
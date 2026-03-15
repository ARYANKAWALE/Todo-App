import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import registerBg from '../assets/images/registerbg.png'

const Register = () => {
  const [data, setData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields first
    if (data.username === "" || data.fullname === "" || data.email === "" || data.password === "") {
      showToast("All fields are required!", "danger");
      return; // Stop execution if validation fails
    }

    if (data.password.length < 6) {
      setMessage("Password must be at least 6 characters long", "danger");
      return;
    }

    console.log("Submitting:", data);
    try {
      const response = await axios.post(
        "/api/v4/users/register",
        data,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        console.log("Success:", response.data);
        showToast("Register Successful!", "success");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        console.log("Failed:", response.data);
        showToast("Register Failed!", "danger");
      }

    } catch (error) {
      console.error("Error:", error);
      showToast(error.response?.data?.message || "User already exists", "danger");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa] text-white relative">
      <img src={registerBg} alt="background" className='absolute top-0 left-0 w-full h-full object-cover -z-0' />
      {/* Bootstrap Toast */}
      {toast.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className={`toast show align-items-center text-white bg-${toast.type} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })} aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 flex-col p-8 border border-gray-300 bg-[#ffffffaa] rounded-lg min-w-[400px] relative z-10"
      >
        <h1 className="text-2xl font-bold mb-4 text-black text-center">Register</h1>
        <div className="flex flex-col text-black">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={data.username}
            onChange={handleChange}
            className="p-2 rounded bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Enter username"
          />
        </div>
        <div className="flex flex-col text-black">
          <label htmlFor="fullname">Fullname</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            value={data.fullname}
            onChange={handleChange}
            className="p-2 rounded bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Enter fullname"
          />
        </div>
        <div className="flex flex-col text-black">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            className="p-2 rounded bg-[#ffffff] border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Enter email"
          />
        </div>
        <div className="flex flex-col text-black">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={data.password}
            onChange={handleChange}
            className="p-2 rounded  border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
          />
          <p className="text-red-500 text-sm">{message}</p>
        </div>
        <button
          type="submit"
          className=" p-2 bg-[#0016df] rounded hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
        <div className="flex justify-center text-black">
          <p>Have an Account?<Link to="/login" className="text-blue-500 hover:underline no-underline">Login</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Register
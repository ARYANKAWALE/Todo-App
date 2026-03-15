import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/v4/users/current-user", {
                withCredentials: true
            })
            setUser(response.data.data)
        } catch (error) {
            console.log("Error fetching user", error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])

    const logout = async () => {
        try {
            await axios.post("/api/v4/users/logout", {}, {
                withCredentials: true
            })
            toast.success("Logged out successfully!")
            setTimeout(() => navigate("/login"), 1000)
        } catch (error) {
            console.log("Logout Failed", error)
            toast.error("Failed to logout. Please try again.")
        }
    }


    return (
        <div className='min-h-screen bg-white text-black flex justify-center items-center'>
            <div className='bg-[#fdfdfd] p-4 text-sm rounded-lg w-[100vw] h-auto md:w-[30vw] md:h-auto justify-center items-center overflow-hidden border'>
                <label htmlFor="username" className='text-sm font-bold'>Username</label>
                <p className='text-2xl border rounded p-2'>{user?.username}</p>
                <label htmlFor="fullname" className='text-sm font-bold'>Fullname</label>
                <p className='text-xl border rounded p-2'>{user?.fullname}</p>
                <label htmlFor="email" className='text-sm font-bold'>Email</label>
                <p className='text-lg border rounded p-2 overflow-hidden'>{user?.email}</p>

                <p className='text-lg rounded p-2 mb-4'>User Created At: <br />
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : ""}
                </p>
                <div className='flex gap-2'>
                    <button className=' w-full text-white p-2 rounded-md bg-blue-500 transition-colors hover:bg-blue-600' onClick={() => navigate('/')} type="button">Return</button>
                    <button onClick={logout} className=' p-2 rounded bg-red-400 font-bold text-white hover:bg-red-600 transition-colors'>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Profile
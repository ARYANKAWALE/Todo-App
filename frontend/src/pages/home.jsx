import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import avatar from "../assets/images/image.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Home = () => {

    const navigate = useNavigate()
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [theme, setTheme] = useState("dark")
    const [query, setQuery] = useState("");

    const fetchTodos = async () => {
        try {
            const response = await axios.get("/api/v4/todos/", {
                withCredentials: true
            })
            setTodos(response.data.data)
        } catch (error) {
            console.log("Error fetching todos", error)
            if (error.response && error.response.status === 401) {
                navigate("/login")
            } else {
                toast.error("Failed to load todos")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/v4/users/current-user", {
                withCredentials: true
            })
            setUser(response.data.data)
        } catch (error) {
            console.log("Error fetching user", error)
            if (error.response && error.response.status === 401) {
                navigate("/login")
            }
        }
    }

    useEffect(() => {
        fetchTodos()
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

    const handleAddTodo = () => {
        navigate("/add")
    }

    const handleEditClick = (todo) => {
        navigate(`/todo/${todo._id}`)

    }

    const handleThemeChange = () => {
        toast("This feature coming Soon!")
    }


    useEffect(() => {
        const searchTodos = async () => {
            if (query.length > 0) {
                try {
                    const res = await axios.get(`/api/v4/todos/search?search=${query}`, {
                        withCredentials: true
                    });
                    setTodos(res.data.data);
                } catch (error) {
                    console.log("Error:", error);
                }
            } else {
                fetchTodos();
            }
        };
        const timer = setTimeout(() => {
            searchTodos();
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [query])


    return (
        <div className="relative min-h-screen w-full flex justify-center items-start bg-gray-100 text-black p-4 overflow-hidden">
            <div className='overflow-y-auto scrollbar-hidden pb-10'>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 pl-6 pr-6">
                    <div className="flex gap-5 items-center justify-between">
                        <div className='flex'>
                            <h2 className=" text-lg md:text-3xl font-bold text-black">Hello {user?.username}👋</h2>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <img className='w-10 h-10 rounded-full' src={avatar} alt='avatar' />
                            <FontAwesomeIcon icon={faGear} onClick={() => setIsOpen(!isOpen)} className={`text-gray-400 text-3xl transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                        </div>
                    </div>
                    <div className="flex gap-2 items-center md:items-center">
                        <input type="search" placeholder="Search Todo" value={query} onChange={(e) => setQuery(e.target.value)} className="w-72 p-2 rounded border-none focus:outline-none focus:border-blue-500 
                         transition transition-all duration-300 animate-right" />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='p-2 rounded bg-blue-500 text-white border-none outline-none' />
                    </div>
                    <div className='flex gap-2 items-center'>
                        {isOpen && (
                            <div className="absolute left-44 top-16 w-48 bg-[#fdfdfd] text-black p-4 rounded-lg shadow-xl border border-[#757575] z-50 flex flex-col items-center">
                                <div className="mt-2">
                                    <Link to="/profile" className="block px-5 py-2 cursor-pointer text-inherit no-underline hover:bg-gray-200 transition-all border rounded-md">Profile</Link>
                                </div>
                                <div onClick={handleThemeChange} className='mt-2'>
                                    <button className="block px-[55px] py-2 cursor-pointer text-inherit no-underline hover:bg-gray-200 transition-all border rounded-md">
                                        {theme === "dark" ? "Dark" : "Light"}
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <Link to="/login" onClick={logout} className="block px-5 py-2 cursor-pointer text-inherit no-underline hover:bg-red-700 border transition-all rounded-md">Logout</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {
                    loading ? (
                        <p className="text-gray-400">Loading todos...</p>
                    ) : todos.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {todos.map((todo) => (
                                <div onClick={() => handleEditClick(todo)} key={todo._id}
                                    className="bg-[#fdfdfd] text-black p-4 max-h-[20vh] rounded-lg text-left overflow-hidden 
                                    w-[25vh] hover:scale-105 transition-transform shadow cursor-pointer md:w-[30vh] w-[20vh] flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-400 line-clamp-2">{todo.headline}</h3>
                                        <p className="text-black mt-2 line-clamp-2">{todo.content}</p>
                                    </div>
                                    <div>
                                        <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                                            <span>Created: {new Date(todo.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div onClick={handleAddTodo} className='border-dashed border-2 p-10 w-64 rounded-lg cursor-pointer border-[#2a3646]'>
                                <p className='text-gray-400 text-center'>Add New Todo</p>
                                <p className='text-center text-2xl'>+</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-full'>
                            <p className="text-gray-400">No todos found.</p>
                            <div onClick={handleAddTodo} className='border-dashed border-2 p-10 w-64 rounded-lg cursor-pointer'>
                                <p className='text-gray-400 text-center'>Add New Todo</p>
                                <p className='text-center text-2xl'>+</p>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    )
}

export default Home
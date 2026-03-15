import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'

const EditTodo = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [headline, setHeadline] = useState('')
    const [content, setContent] = useState('')
    const [initialHeadline, setInitialHeadline] = useState('')
    const [initialContent, setInitialContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    const fetchTodo = async () => {
        try {
            const response = await axios.get(`/api/v4/todos/${id}`, {
                withCredentials: true
            })
            console.log("Fetched Todo:", response.data)
            setHeadline(response.data.data.headline)
            setContent(response.data.data.content)
            setInitialHeadline(response.data.data.headline)
            setInitialContent(response.data.data.content)
            setLoading(false)
        } catch (error) {
            console.log("Error fetching todo", error)
            toast.error("Failed to load todo")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTodo()
    }, [id])

    const handleUpdate = async (e) => {
        e.preventDefault()

        const updatePromise = axios.patch(`/api/v4/todos/modify/${id}`, {
            headline: headline,
            content: content
        }, {
            withCredentials: true
        })

        toast.promise(
            updatePromise,
            {
                loading: 'Updating todo...',
                success: 'Todo updated successfully!',
                error: 'Failed to update todo',
            }
        )

        try {
            const response = await updatePromise
            console.log("Update Success:", response.data)
            setTimeout(() => navigate('/'), 1000)
        } catch (error) {
            console.log("Error updating todo", error)
        }
    }

    const handleDeleteTodo = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this todo? This action cannot be undone."
        )

        if (!confirmDelete) return

        setDeleting(true)

        const deletePromise = axios.delete(`/api/v4/todos/modify/${id}`, {
            withCredentials: true
        })

        toast.promise(
            deletePromise,
            {
                loading: 'Deleting todo...',
                success: 'Todo deleted successfully!',
                error: (err) => {
                    const errorMessage = err.response?.data?.message || 'Failed to delete todo. Please try again.'
                    return errorMessage
                },
            }
        )

        try {
            await deletePromise
            setTimeout(() => navigate("/"), 1000)
        } catch (error) {
            console.error("Error deleting todo:", error)
        } finally {
            setDeleting(false)
        }
    }

    const isChanged = headline !== initialHeadline || content !== initialContent

    if (loading) return (
        <div className="min-h-screen text-black flex justify-center items-center">
            <div className="text-xl">Loading Todo...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#fafafa] text-black flex justify-center items-center p-4">
            <div className='bg-[#fdfdfd] rounded-2xl shadow-xl w-full max-w-[70vh] pb-8'>
                <div className='flex gap-2 bg-gray-500 p-2 rounded-tr-2xl rounded-tl-2xl'>
                    <div className='w-4 h-4 bg-red-500 rounded-full flex items-center justify-center group cursor-pointer hover:bg-red-600 transition-colors'>
                        <span className='hidden group-hover:block text-[10px] font-bold text-red-900'>×</span>
                    </div>
                    <div className='w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center group cursor-pointer hover:bg-yellow-600 transition-colors'>
                        <span className='hidden group-hover:block text-[10px] font-bold text-yellow-900'>−</span>
                    </div>
                    <div className='w-4 h-4 bg-green-500 rounded-full flex items-center justify-center group cursor-pointer hover:bg-green-600 transition-colors'>
                        <span className='hidden group-hover:block text-[10px] font-bold text-green-900'>+</span>
                    </div>
                </div>
                <div className='flex justify-between items-center mb-6 pl-6 pr-6 pt-2'>
                    <h1 className="text-3xl font-bold text-center text-blue-500">Edit Todo</h1>
                    <FontAwesomeIcon
                        icon={faTrashCan}
                        className={`hover:text-red-500 transition-colors text-gray-500 text-3xl ${deleting
                            ? 'opacity-50 cursor-not-allowed animate-pulse'
                            : 'cursor-pointer'
                            }`}
                        onClick={() => !deleting && handleDeleteTodo(id)}
                        title={deleting ? "Deleting..." : "Delete Todo"}
                    />
                </div>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2 pl-6 pr-6">
                        <label className="text-gray-400 text-sm">Headline</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="bg-gray-200 text-black p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Headline"
                            disabled={deleting}
                        />
                    </div>

                    <div className="flex flex-col gap-2 pl-6 pr-6">
                        <label className="text-gray-400 text-sm">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="6"
                            className="bg-gray-200 text-black p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Enter Content"
                            disabled={deleting}
                        />
                    </div>

                    <div className="flex gap-4 mt-4 pl-6 pr-6">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                            disabled={deleting}
                        >
                            Cancel
                        </button>
                        <button onClick={handleUpdate}
                            type="submit"
                            disabled={!isChanged || deleting}
                            className={`flex-1 font-bold py-3 rounded-lg transition-all shadow-lg ${isChanged && !deleting
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Update Todo
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default EditTodo
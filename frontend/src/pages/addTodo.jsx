import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddTodo = () => {
    const navigate = useNavigate()
    const [headline, setHeadline] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/v4/todos/add', {
                headline,
                content
            }, {
                withCredentials: true
            })
            toast.success("Todo added successfully")
            navigate('/')
        } catch (error) {
            console.log("Error adding todo", error)
            toast.error("Failed to add todo")
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className='min-h-screen bg-[#fafafa] text-black flex justify-center items-center p-4'>
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
                <h2 className='text-2xl font-bold mb-6 pl-6 pr-6'>Add New Todo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 pl-6 pr-6">
                        <label htmlFor="headline" className="block text-sm font-medium mb-2">Headline</label>
                        <input type="text" id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-2 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4 pl-6 pr-6">
                        <label htmlFor="content" className="block text-sm font-medium mb-2">Content</label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 text-black bg-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div className='flex justify-between items-center gap-10 pl-6 pr-6'>
                        <button className=' w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors' onClick={() => navigate('/')} type="button">Cancel</button>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">Add Todo</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTodo
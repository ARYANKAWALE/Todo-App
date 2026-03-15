import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Home from './pages/home.jsx'
import EditTodo from './pages/editTodo.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Profile from './pages/profile.jsx'
import { Toaster } from 'react-hot-toast'
import AddTodo from './pages/addTodo.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path='/todo/:id' element={<EditTodo />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/add' element={<AddTodo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

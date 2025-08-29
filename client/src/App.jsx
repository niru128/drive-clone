
import { Toaster } from 'sonner'
import './App.css'
import { Button } from './components/ui/button'
// import { Route,Routes } from 'lucide-react'
import SIgnup from './components/SIgnup'
import { Link, Routes } from 'react-router-dom'
import { Route } from 'lucide-react'
import Login from './components/Login'

function App() {
 

  return (
    <>

      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-4xl font-bold mb-8'>Welcome to Drive Clone</h1>
      <div className='space-x-4'>
        <Link to="/login">
          <Button className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer'>Login</Button>
        </Link>
        <Link to="/signup">
          <Button className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer'>Sign Up</Button>
        </Link>

      </div>

      </div>  
    
    
    </>
  )
}

export default App

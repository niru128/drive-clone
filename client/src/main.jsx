import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login.jsx';
import SIgnup from './components/SIgnup.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

      <Toaster position="top-center" closeButton  richColors />

      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SIgnup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  </StrictMode>
)

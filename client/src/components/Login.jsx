import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // ✅ for navigation

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", {
                email, password
            });

            toast.success("Login Successful!");
            console.log("Login Response", res.data);

            // ✅ optional: save token/user data to localStorage
            localStorage.setItem("token", res.data.token);

            setEmail("");
            setPassword("");

            // ✅ navigate to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.log("Login Error", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login Failed! Please try again.");
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <Card className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
                <CardHeader className='text-center text-4xl font-bold mb-4'>Login</CardHeader>
                <CardContent>
                    <form className='space-y-4 flex flex-col' onSubmit={handleLogin}>
                        <input
                            type='email'
                            className='p-4 rounded-2xl border-2'
                            value={email}
                            placeholder='Enter your email'
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            className='p-4 rounded-2xl border-2'
                            value={password}
                            placeholder='Enter your password'
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button type="submit" className='cursor-pointer'>Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

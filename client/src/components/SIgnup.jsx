import React, { useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export default function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // ✅ React Router hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5001/api/auth/signup', {
                name,
                email,
                password
            });

            toast.success("Signup successful!");
            console.log("Signup response:", res.data);

            // clear inputs
            setName("");
            setEmail("");
            setPassword("");

            // ✅ Redirect to login page after signup
            navigate('/login');

        } catch (error) {
            console.log("Error during signup:", error);
            toast.error("Signup failed. Please try again.");
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <Card className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
                <CardHeader className='text-center text-2xl font-bold mb-4'>Sign Up</CardHeader>
                <CardContent>
                    <form className='space-y-4 flex flex-col' onSubmit={handleSubmit}>
                        <input type='text' className='p-4 rounded-2xl border-2'
                            value={name} placeholder='Enter your name'
                            onChange={e => setName(e.target.value)} />

                        <input type='email' className='p-4 rounded-2xl border-2'
                            value={email} placeholder='Enter your email'
                            onChange={e => setEmail(e.target.value)} />

                        <input type='password' className='p-4 rounded-2xl border-2'
                            value={password} placeholder='Enter your password'
                            onChange={e => setPassword(e.target.value)} />

                        <Button type="submit" className='cursor-pointer'>
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

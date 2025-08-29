import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = express.Router();


//signup

router.post('/signup', async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


//login

router.post('/login', async (req, res)=>{
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message : 'Please enter all fields'});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message : 'Invalid credentials'});
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '7d'});
        res.json({token, user : {id : user._id, name : user.name, email : user.email}});

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})


export default router;
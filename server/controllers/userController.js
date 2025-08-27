import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({ success: false, message: "Missing Detailes Fill" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            name, email, password: hashedPassword
        }

        const newUser = new User(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,//prevent js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',//csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
        })


        return res.json({ success: true, user: { email: user.email, name: user.name } })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "user Controller Api" })
    }
}


export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.send({ success: false, message: "User Not Available" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false, message: "user invalid"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,//prevent js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',//csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
        })


        return res.json({ success: true, user: { email: user.email, name: user.name } })




    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "user Controller login Api" })
    }
}


//middleware
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({ success: true, user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "user Controller login Api" })

    }
}

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "user Controller login Api" })

    }
}
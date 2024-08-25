import { userModel } from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (request, response) => {
    try {
        const { fullname, email, phone, password, role } = request.body;
        const file = request.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        if (!fullname || !email || !phone || !password || !role) {
            return response.status(400).json({
                success: false,
                message: "Please fill in all fields"
            });
        }
        const user = await userModel.findOne({ email });
        if (user) {
            return response.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });
        return response.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                name: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone
            }
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const login = async (request, response) => {
    try {
        const { email, password, role } = request.body;
        if (!email || !password || !role) {
            return response.status(400).json({
                success: false,
                message: "Please fill in all fields"
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                success: false,
                message: "Email not found"
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        if (role !== user.role) {
            return response.status(400).json({
                success: false,
                message: "Account does not exist with current role"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return response.status(200).cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                name: user.fullname,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile: user.profile
            },
            token
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const logout = async (request, response) => {
    try {
        return response.status(200).cookie('token', '', {
            maxAge: 0
        }).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateProfile = async (request, response) => {
    try {
        const { fullname, email, phone, bio, skills } = request.body;
        const file = request.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        let skillsArray;
        if (skills) skillsArray = skills.split(',');
        const userId = request.id;
        let user = await userModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }
        await user.save();
        return response.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: user.fullname,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile: user.profile
            }
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
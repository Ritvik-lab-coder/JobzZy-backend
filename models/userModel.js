import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'recruiter'],
        required: true
    },
    profile: {
        bio: {
            type: String
        },
        skills: [{
            type: String
        }],
        resume: {
            type: String
        },
        resumeOriginalName: {
            type: String
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'company'
        },
        profilePhoto: {
            type: String,
            default: ''
        }
    }
}, { timestamps: true });

export const userModel = mongoose.model('users', userSchema);
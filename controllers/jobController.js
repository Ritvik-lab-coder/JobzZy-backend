import { jobModel } from "../models/jobModel.js";

export const postJob = async (request, response) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = request.body;
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return response.status(400).json({
                success: false,
                message: 'Please fill in all fields'
            });
        }
        const newJob = await jobModel.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experience,
            position,
            company: companyId,
            createdBy: request.id
        });
        return response.status(201).json({
            success: true,
            message: 'Job posted successfully',
            job: newJob
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllJobs = async (request, response) => {
    try {
        const keyword = request.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }
        const jobs = await jobModel.find(query).populate({ path: "company" }).sort({ createdAt: -1 });
        if (!jobs) {
            return response.status(404).json({
                success: false,
                message: 'No jobs found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully',
            jobs
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getJobById = async (request, response) => {
    try {
        const jobId = request.params.id;
        const job = await jobModel.findById(jobId).populate({
            path: 'applications'
        });
        if (!job) {
            return response.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Job retrieved successfully',
            job
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getRecruiterJobs = async (request, response) => {
    try {
        const adminId = request.id;
        const recruiterJobs = await jobModel.find({ createdBy: adminId }).populate({
            path: 'company'
        });
        if (!recruiterJobs) {
            return response.status(404).json({
                success: false,
                message: 'No jobs found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully',
            recruiterJobs
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
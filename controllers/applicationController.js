import { applicationModel } from '../models/applicationModel.js'
import { jobModel } from '../models/jobModel.js';

export const applyJob = async (request, response) => {
    try {
        const userId = request.id;
        const jobId = request.params.id;
        const existingApplication = await applicationModel.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return response.status(400).json({
                success: false,
                message: 'You have already applied for this job.'
            });
        }
        const job = await jobModel.findById(jobId);
        if (!job) {
            return response.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        const application = await applicationModel.create({
            job: jobId,
            applicant: userId,
        });
        job.applications.push(application._id);
        await job.save();
        return response.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: application
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getAppliedJobs = async (request, response) => {
    try {
        const userId = request.id;
        const applications = await applicationModel.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!applications) {
            return response.status(404).json({
                success: false,
                message: 'No applications found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            applications: applications
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getApplications = async (request, response) => {
    try {
        const jobId = request.params.id;
        const job = await jobModel.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!job) {
            return response.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Applicants retrieved successfully',
            applicants: job.applications
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const updateStatus = async (request, response) => {
    try {
        const { status } = request.body;
        const applicationId = request.params.id;
        if (!status) {
            return response.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        let application = await applicationModel.findOne({ _id: applicationId });
        if (!application) {
            return response.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        application.status = status.toLowerCase();
        await application.save();
        return response.status(200).json({
            success: true,
            message: 'Application status updated successfully',
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
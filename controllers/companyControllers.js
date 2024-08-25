import { companyModel } from '../models/companyModel.js'
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (request, response) => {
    try {
        const { companyName } = request.body;
        if (!companyName) {
            return response.status(400).json({
                success: false,
                message: 'Company name is required'
            });
        }
        let company = await companyModel.findOne({ companyName });
        if (company) {
            return response.status(400).json({
                success: false,
                message: 'Company already exists'
            });
        }
        company = await companyModel.create({
            name: companyName,
            userId: request.id
        });
        return response.status(201).json({
            success: true,
            message: 'Company created successfully',
            company
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getCompany = async (request, response) => {
    try {
        const userId = request.id;
        const companies = await companyModel.find({ userId });
        if (!companies) {
            return response.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Companies found',
            companies
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getCompanyById = async (request, response) => {
    try {
        const companyId = request.params.id;
        const company = await companyModel.findById(companyId);
        if (!company) {
            return response.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Company found',
            company
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateCompany = async (request, response) => {
    try {
        const { name, description, website, location } = request.body;
        const file = request.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
        const updateData = { name, description, website, location, logo };
        const company = await companyModel.findByIdAndUpdate(request.params.id, updateData, { new: true });
        if (!company) {
            return response.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        return response.status(200).json({
            success: true,
            message: "Company updated successfully",
            company
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
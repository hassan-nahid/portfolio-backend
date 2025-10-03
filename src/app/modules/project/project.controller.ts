import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { projectServices } from "./project.service"


const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const projectData = {
        ...req.body,
        image: req.file?.path || req.body.image // Use uploaded file path or existing image URL
    }
    
    // Ensure image is provided for new projects
    if (!projectData.image) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Image is required. Please provide an image URL or upload a file.",
            data: null
        })
    }
    
    const project = await projectServices.createProject(projectData)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Project Created successfully",
        data: project
    })
})

const getAllProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const projects = await projectServices.getAllProjects()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Projects retrieved successfully",
        data: projects
    })
})

const getProjectById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const project = await projectServices.getProjectById(id)
    
    if (!project) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Project not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project retrieved successfully",
        data: project
    })
})

const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    
    // First, get the existing project to preserve current image if no new one is provided
    const existingProject = await projectServices.getProjectById(id)
    
    if (!existingProject) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Project not found",
            data: null
        })
    }
    
    const updateData = {
        ...req.body
    }
    
    // Handle image update logic:
    // 1. If new file is uploaded, use the file path
    // 2. If image URL is provided in body and not empty, use that
    // 3. If no image provided or empty, remove from updateData to preserve existing
    if (req.file?.path) {
        updateData.image = req.file.path
    } else if (req.body.image && req.body.image.trim() !== '') {
        updateData.image = req.body.image
    } else {
        // Remove image field from update to preserve existing image
        delete updateData.image
    }
    
    const project = await projectServices.updateProject(id, updateData)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project updated successfully",
        data: project
    })
})

const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const project = await projectServices.deleteProject(id)
    
    if (!project) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Project not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Project deleted successfully",
        data: project
    })
})

export const projectControllers = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}
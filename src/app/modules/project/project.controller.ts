import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { projectServices } from "./project.service"


const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const project = await projectServices.createProject(req.body)
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
    const project = await projectServices.updateProject(id, req.body)
    
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
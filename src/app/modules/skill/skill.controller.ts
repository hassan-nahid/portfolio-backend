import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { skillServices } from "./skill.service"

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await skillServices.createCategory(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Skill Category Created successfully",
        data: category
    })
})

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await skillServices.getAllCategories()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill Categories retrieved successfully",
        data: categories
    })
})

const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const category = await skillServices.getCategoryById(id)
    
    if (!category) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill Category retrieved successfully",
        data: category
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const category = await skillServices.updateCategory(id, req.body)
    
    if (!category) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill Category updated successfully",
        data: category
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const category = await skillServices.deleteCategory(id)
    
    if (!category) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill Category deleted successfully",
        data: category
    })
})

// Skill controllers
const createSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let skillData = req.body
    
    // If logo file is uploaded, add the Cloudinary URL
    if (req.file) {
        skillData.logo = (req.file as any).path
    }
    
    // Ensure logo is provided for new skills
    if (!skillData.logo) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: "Logo is required. Please provide a logo URL or upload a file.",
            data: null
        })
    }
    
    const skill = await skillServices.createSkill(skillData)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Skill Created successfully",
        data: skill
    })
})

const getAllSkills = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const skills = await skillServices.getAllSkills()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skills retrieved successfully",
        data: skills
    })
})

const getSkillById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const skill = await skillServices.getSkillById(id)
    
    if (!skill) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill retrieved successfully",
        data: skill
    })
})

const updateSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    
    // First, get the existing skill to preserve current logo if no new one is provided
    const existingSkill = await skillServices.getSkillById(id)
    
    if (!existingSkill) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill not found",
            data: null
        })
    }
    
    let skillData = req.body
    
    // Handle logo update logic:
    // 1. If new file is uploaded, use the file path
    // 2. If logo URL is provided in body and not empty, use that
    // 3. If no logo provided or empty, remove from updateData to preserve existing
    if (req.file) {
        skillData.logo = (req.file as any).path
    } else if (req.body.logo && req.body.logo.trim() !== '') {
        skillData.logo = req.body.logo
    } else {
        // Remove logo field from update to preserve existing logo
        delete skillData.logo
    }
    
    const skill = await skillServices.updateSkill(id, skillData)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill updated successfully",
        data: skill
    })
})

const deleteSkill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const skill = await skillServices.deleteSkill(id)
    
    if (!skill) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "Skill not found",
            data: null
        })
    }
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Skill deleted successfully",
        data: skill
    })
})

export const skillControllers = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
}
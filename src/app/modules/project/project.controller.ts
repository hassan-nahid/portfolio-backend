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
        message: "Project Created successfull",
        data: project
    })
})

export const projectControllers = {
    createProject
}
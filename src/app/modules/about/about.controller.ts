import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AboutService } from "./about.service";

const createAbout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AboutService.createAbout(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "About section created successfully",
    data: result,
  });
});

const getAbout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AboutService.getAbout();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result ? "About section retrieved successfully" : "No about section found",
    data: result,
  });
});

const getAboutById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await AboutService.getAboutById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "About section retrieved successfully",
    data: result,
  });
});

const updateAbout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await AboutService.updateAbout(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "About section updated successfully",
    data: result,
  });
});



const deleteAbout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await AboutService.deleteAbout(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "About section deleted successfully",
    data: null,
  });
});



export const AboutController = {
  createAbout,
  getAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
};
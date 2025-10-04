"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectControllers = void 0;
const CatchAsync_1 = require("../../utils/CatchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const project_service_1 = require("./project.service");
const createProject = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const projectData = Object.assign(Object.assign({}, req.body), { image: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || req.body.image // Use uploaded file path or existing image URL
     });
    // Ensure image is provided for new projects
    if (!projectData.image) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Image is required. Please provide an image URL or upload a file.",
            data: null
        });
    }
    const project = yield project_service_1.projectServices.createProject(projectData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Project Created successfully",
        data: project
    });
}));
const getAllProjects = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_service_1.projectServices.getAllProjects();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Projects retrieved successfully",
        data: projects
    });
}));
const getProjectById = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const project = yield project_service_1.projectServices.getProjectById(id);
    if (!project) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Project not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Project retrieved successfully",
        data: project
    });
}));
const updateProject = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // First, get the existing project to preserve current image if no new one is provided
    const existingProject = yield project_service_1.projectServices.getProjectById(id);
    if (!existingProject) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Project not found",
            data: null
        });
    }
    const updateData = Object.assign({}, req.body);
    // Handle image update logic:
    // 1. If new file is uploaded, use the file path
    // 2. If image URL is provided in body and not empty, use that
    // 3. If no image provided or empty, remove from updateData to preserve existing
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        updateData.image = req.file.path;
    }
    else if (req.body.image && req.body.image.trim() !== '') {
        updateData.image = req.body.image;
    }
    else {
        // Remove image field from update to preserve existing image
        delete updateData.image;
    }
    const project = yield project_service_1.projectServices.updateProject(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Project updated successfully",
        data: project
    });
}));
const deleteProject = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const project = yield project_service_1.projectServices.deleteProject(id);
    if (!project) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Project not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Project deleted successfully",
        data: project
    });
}));
exports.projectControllers = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};

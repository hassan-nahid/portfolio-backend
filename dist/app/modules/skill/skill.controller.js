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
exports.skillControllers = void 0;
const CatchAsync_1 = require("../../utils/CatchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const skill_service_1 = require("./skill.service");
const createCategory = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield skill_service_1.skillServices.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Skill Category Created successfully",
        data: category
    });
}));
const getAllCategories = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield skill_service_1.skillServices.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill Categories retrieved successfully",
        data: categories
    });
}));
const getCategoryById = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield skill_service_1.skillServices.getCategoryById(id);
    if (!category) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill Category retrieved successfully",
        data: category
    });
}));
const updateCategory = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield skill_service_1.skillServices.updateCategory(id, req.body);
    if (!category) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill Category updated successfully",
        data: category
    });
}));
const deleteCategory = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield skill_service_1.skillServices.deleteCategory(id);
    if (!category) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill Category not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill Category deleted successfully",
        data: category
    });
}));
// Skill controllers
const createSkill = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let skillData = req.body;
    // If logo file is uploaded, add the Cloudinary URL
    if (req.file) {
        skillData.logo = req.file.path;
    }
    // Ensure logo is provided for new skills
    if (!skillData.logo) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Logo is required. Please provide a logo URL or upload a file.",
            data: null
        });
    }
    const skill = yield skill_service_1.skillServices.createSkill(skillData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Skill Created successfully",
        data: skill
    });
}));
const getAllSkills = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield skill_service_1.skillServices.getAllSkills();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skills retrieved successfully",
        data: skills
    });
}));
const getSkillById = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const skill = yield skill_service_1.skillServices.getSkillById(id);
    if (!skill) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill retrieved successfully",
        data: skill
    });
}));
const updateSkill = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // First, get the existing skill to preserve current logo if no new one is provided
    const existingSkill = yield skill_service_1.skillServices.getSkillById(id);
    if (!existingSkill) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill not found",
            data: null
        });
    }
    let skillData = req.body;
    // Handle logo update logic:
    // 1. If new file is uploaded, use the file path
    // 2. If logo URL is provided in body and not empty, use that
    // 3. If no logo provided or empty, remove from updateData to preserve existing
    if (req.file) {
        skillData.logo = req.file.path;
    }
    else if (req.body.logo && req.body.logo.trim() !== '') {
        skillData.logo = req.body.logo;
    }
    else {
        // Remove logo field from update to preserve existing logo
        delete skillData.logo;
    }
    const skill = yield skill_service_1.skillServices.updateSkill(id, skillData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill updated successfully",
        data: skill
    });
}));
const deleteSkill = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const skill = yield skill_service_1.skillServices.deleteSkill(id);
    if (!skill) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "Skill not found",
            data: null
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Skill deleted successfully",
        data: skill
    });
}));
exports.skillControllers = {
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
};

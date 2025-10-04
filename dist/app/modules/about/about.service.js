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
exports.AboutService = void 0;
const about_model_1 = require("./about.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createAbout = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if an about record already exists
    const existingAbout = yield about_model_1.About.findOne({});
    if (existingAbout) {
        throw new AppError_1.default(409, "About section already exists. Only one about record is allowed. Please update the existing record instead.");
    }
    const about = yield about_model_1.About.create(payload);
    return about;
});
const getAbout = () => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_model_1.About.findOne({});
    return about;
});
const getAboutById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_model_1.About.findById(id);
    if (!about) {
        throw new AppError_1.default(404, "About section not found");
    }
    return about;
});
const updateAbout = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_model_1.About.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!about) {
        throw new AppError_1.default(404, "About section not found");
    }
    return about;
});
const updateAboutDirect = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the existing about record and update it
    let about = yield about_model_1.About.findOne({});
    if (!about) {
        throw new AppError_1.default(404, "About section not found. Please create one first.");
    }
    about = yield about_model_1.About.findByIdAndUpdate(about._id, payload, { new: true, runValidators: true });
    if (!about) {
        throw new AppError_1.default(404, "Failed to update about section");
    }
    return about;
});
const deleteAbout = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_model_1.About.findByIdAndDelete(id);
    if (!about) {
        throw new AppError_1.default(404, "About section not found");
    }
});
const deleteAboutDirect = () => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_model_1.About.findOneAndDelete({});
    if (!about) {
        throw new AppError_1.default(404, "About section not found");
    }
});
exports.AboutService = {
    createAbout,
    getAbout,
    getAboutById,
    updateAbout,
    updateAboutDirect,
    deleteAbout,
    deleteAboutDirect
};

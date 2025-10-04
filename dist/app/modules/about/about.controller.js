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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutController = void 0;
const CatchAsync_1 = require("../../utils/CatchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const about_service_1 = require("./about.service");
const createAbout = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const aboutData = Object.assign(Object.assign({}, req.body), { photo: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "" });
    const result = yield about_service_1.AboutService.createAbout(aboutData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "About section created successfully",
        data: result,
    });
}));
const getAbout = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield about_service_1.AboutService.getAbout();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: result ? "About section retrieved successfully" : "No about section found",
        data: result,
    });
}));
const getAboutById = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield about_service_1.AboutService.getAboutById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "About section retrieved successfully",
        data: result,
    });
}));
const updateAbout = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = Object.assign(Object.assign({}, req.body), (req.file && { photo: req.file.path }));
    const result = yield about_service_1.AboutService.updateAbout(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "About section updated successfully",
        data: result,
    });
}));
const deleteAbout = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield about_service_1.AboutService.deleteAbout(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "About section deleted successfully",
        data: null,
    });
}));
exports.AboutController = {
    createAbout,
    getAbout,
    getAboutById,
    updateAbout,
    deleteAbout,
};

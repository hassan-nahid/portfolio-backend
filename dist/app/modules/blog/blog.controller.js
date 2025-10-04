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
exports.BlogController = void 0;
const CatchAsync_1 = require("../../utils/CatchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const blog_service_1 = require("./blog.service");
// ================== ADMIN CONTROLLERS ==================
// Create blog (Admin only)
const createBlog = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const blogData = Object.assign(Object.assign({}, req.body), { author: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, featuredImage: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || undefined });
    const result = yield blog_service_1.BlogService.createBlog(blogData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
}));
// Get all blogs for admin (with filtering)
const getAllBlogsForAdmin = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getAllBlogsForAdmin(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
}));
// Update blog (Admin only)
const updateBlog = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = Object.assign(Object.assign({}, req.body), (req.file && { featuredImage: req.file.path }));
    const result = yield blog_service_1.BlogService.updateBlog(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
}));
// Delete blog (Admin only)
const deleteBlog = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield blog_service_1.BlogService.deleteBlog(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: null,
    });
}));
// Manage comment (Admin only) - approve/reject
const manageComment = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const result = yield blog_service_1.BlogService.manageComment(commentId, action);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Comment ${action}d successfully`,
        data: result,
    });
}));
// Get single blog by ID for admin (includes drafts)
const getBlogById = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_service_1.BlogService.getBlogByIdForAdmin(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: result,
    });
}));
// ================== PUBLIC CONTROLLERS ==================
// Get published blogs (with search, category, pagination)
const getBlogs = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getPublicBlogs(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
}));
// Get single blog by ID or slug
const getBlog = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.params; // Can be ID or slug
    const result = yield blog_service_1.BlogService.getBlogByIdentifier(identifier);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: result,
    });
}));
// Add comment to blog (anonymous)
const addComment = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const commentData = Object.assign(Object.assign({}, req.body), { ipAddress: req.ip, userAgent: req.get('User-Agent') });
    const result = yield blog_service_1.BlogService.addComment(id, commentData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Comment added successfully. It will be visible after admin approval.",
        data: result,
    });
}));
// Get approved comments for a blog
const getComments = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_service_1.BlogService.getBlogComments(id, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Comments retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
}));
// Get comprehensive blog statistics (Admin only)
const getBlogStats = (0, CatchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getBlogStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Blog statistics retrieved successfully",
        data: result,
    });
}));
exports.BlogController = {
    // Admin controllers
    createBlog,
    getAllBlogsForAdmin,
    getBlogById,
    updateBlog,
    deleteBlog,
    manageComment,
    getBlogStats,
    // Public controllers
    getBlogs,
    getBlog,
    addComment,
    getComments
};

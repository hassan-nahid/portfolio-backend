"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const ValidateFormData_1 = require("../../middleware/ValidateFormData");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// ================== ADMIN ROUTES (Protected) ==================
// Create blog (Admin only)
router.post("/create", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("featuredImage"), ValidateFormData_1.validateBlogFormData, blog_controller_1.BlogController.createBlog);
// Get blog statistics (Admin only) - MUST come before /admin/:id
router.get("/admin/stats", (0, CheckAuth_1.checkAuth)("OWNER"), blog_controller_1.BlogController.getBlogStats);
// Get all blogs for admin (with query support for filtering)
router.get("/admin", (0, CheckAuth_1.checkAuth)("OWNER"), blog_controller_1.BlogController.getAllBlogsForAdmin);
router.get("/admin/:id", (0, CheckAuth_1.checkAuth)("OWNER"), blog_controller_1.BlogController.getBlogById);
// Update blog (Admin only)
router.patch("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), multer_config_1.multerUpload.single("featuredImage"), ValidateFormData_1.validateBlogFormData, blog_controller_1.BlogController.updateBlog);
// Delete blog (Admin only)
router.delete("/:id", (0, CheckAuth_1.checkAuth)("OWNER"), blog_controller_1.BlogController.deleteBlog);
// Manage comments (Admin only) - approve/reject
router.patch("/comments/:commentId", (0, CheckAuth_1.checkAuth)("OWNER"), blog_controller_1.BlogController.manageComment);
// Remove duplicate stats route (moved up)
// ================== PUBLIC ROUTES ==================
// Get published blogs (with search, category, pagination)
router.get("/", blog_controller_1.BlogController.getBlogs);
// Get single blog by ID or slug
router.get("/:identifier", blog_controller_1.BlogController.getBlog);
// Add comment to blog (anonymous)
router.post("/:id/comments", blog_controller_1.BlogController.addComment);
// Get comments for a blog
router.get("/:id/comments", blog_controller_1.BlogController.getComments);
exports.BlogRoutes = router;

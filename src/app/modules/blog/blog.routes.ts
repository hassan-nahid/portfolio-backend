import express from "express";
import { BlogController } from "./blog.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { validateBlogFormData } from "../../middleware/ValidateFormData";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// ================== ADMIN ROUTES (Protected) ==================

// Create blog (Admin only)
router.post(
  "/create",
  checkAuth("OWNER"),
  multerUpload.single("featuredImage"),
  validateBlogFormData,
  BlogController.createBlog
);

// Get all blogs for admin (with query support for filtering)
router.get(
  "/admin",
  checkAuth("OWNER"),
  BlogController.getAllBlogsForAdmin
);

router.get(
  "/admin/:id",
  checkAuth("OWNER"),
  BlogController.getBlogById
);

// Update blog (Admin only)
router.patch(
  "/:id",
  checkAuth("OWNER"),
  multerUpload.single("featuredImage"),
  validateBlogFormData,
  BlogController.updateBlog
);

// Delete blog (Admin only)
router.delete(
  "/:id",
  checkAuth("OWNER"),
  BlogController.deleteBlog
);

// Manage comments (Admin only) - approve/reject
router.patch(
  "/comments/:commentId",
  checkAuth("OWNER"),
  BlogController.manageComment
);

// ================== PUBLIC ROUTES ==================

// Get published blogs (with search, category, pagination)
router.get(
  "/",
  BlogController.getBlogs
);

// Get single blog by ID or slug
router.get(
  "/:identifier",
  BlogController.getBlog
);

// Add comment to blog (anonymous)
router.post(
  "/:id/comments",
  BlogController.addComment
);

// Get comments for a blog
router.get(
  "/:id/comments",
  BlogController.getComments
);

export const BlogRoutes = router;

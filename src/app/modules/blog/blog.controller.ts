import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BlogService } from "./blog.service";

// ================== ADMIN CONTROLLERS ==================

// Create blog (Admin only)
const createBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const blogData = {
    ...req.body,
    author: req.user?.userId, // Admin ID from JWT token
    featuredImage: req.file?.path || undefined
  };

  const result = await BlogService.createBlog(blogData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

// Get all blogs for admin (with filtering)
const getAllBlogsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await BlogService.getAllBlogsForAdmin(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

// Update blog (Admin only)
const updateBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    ...(req.file && { featuredImage: req.file.path })
  };

  const result = await BlogService.updateBlog(id, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

// Delete blog (Admin only)
const deleteBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await BlogService.deleteBlog(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully",
    data: null,
  });
});

// Manage comment (Admin only) - approve/reject
const manageComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  const result = await BlogService.manageComment(commentId, action);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Comment ${action}d successfully`,
    data: result,
  });
});

// Get single blog by ID for admin (includes drafts)
const getBlogById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await BlogService.getBlogByIdForAdmin(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

// ================== PUBLIC CONTROLLERS ==================

// Get published blogs (with search, category, pagination)
const getBlogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await BlogService.getPublicBlogs(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

// Get single blog by ID or slug
const getBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params; // Can be ID or slug
  const result = await BlogService.getBlogByIdentifier(identifier);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

// Add comment to blog (anonymous)
const addComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const commentData = {
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  };

  const result = await BlogService.addComment(id, commentData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Comment added successfully. It will be visible after admin approval.",
    data: result,
  });
});

// Get approved comments for a blog
const getComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await BlogService.getBlogComments(id, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

// Get comprehensive blog statistics (Admin only)
const getBlogStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await BlogService.getBlogStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog statistics retrieved successfully",
    data: result,
  });
});

export const BlogController = {
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

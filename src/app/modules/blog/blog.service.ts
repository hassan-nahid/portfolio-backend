import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Blog } from "./blog.model";
import { 
  IBlog, 
  ICreateBlog, 
  IUpdateBlog, 
  ICreateComment, 
  IBlogQuery,
  BlogStatus
} from "./blog.interface";
import AppError from "../../errorHelpers/AppError";

// ================== ADMIN SERVICES ==================

// Create new blog
const createBlog = async (blogData: ICreateBlog) => {
  const blog = await Blog.create({
    ...blogData,
    status: BlogStatus.PUBLISHED // Default to published for admin
  });
  
  await blog.populate('author', 'name email avatar');
  return blog;
};

// Get all blogs for admin (includes drafts)
const getAllBlogsForAdmin = async (query: Record<string, unknown>) => {
  const queryStr = query as Record<string, string>;
  const blogQuery = new QueryBuilder(
    Blog.find().populate('author', 'name email avatar'),
    queryStr
  )
    .search(['title', 'content', 'tags'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.getMeta();

  return { result, meta };
};

// Get single blog by ID for admin (includes drafts)
const getBlogByIdForAdmin = async (id: string) => {
  const blog = await Blog.findById(id).populate('author', 'name email avatar');
  
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  return blog;
};

// Update blog
const updateBlog = async (id: string, updateData: IUpdateBlog) => {
  const blog = await Blog.findById(id);
  
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  const updated = await Blog.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('author', 'name email avatar');

  return updated;
};

// Delete blog
const deleteBlog = async (id: string) => {
  const blog = await Blog.findById(id);
  
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  await Blog.findByIdAndDelete(id);
  return null;
};

// Manage comment (approve/reject)
const manageComment = async (commentId: string, action: 'approve' | 'reject') => {
  const isApproved = action === 'approve';
  
  const blog = await Blog.findOneAndUpdate(
    { 'comments._id': commentId },
    { $set: { 'comments.$.isApproved': isApproved } },
    { new: true }
  );

  if (!blog) {
    throw new AppError(404, "Comment not found");
  }

  const comment = blog.comments.find(c => c._id?.toString() === commentId);
  return comment;
};

// ================== PUBLIC SERVICES ==================

// Get published blogs for public
const getPublicBlogs = async (query: IBlogQuery) => {
  const baseQuery = Blog.find({ status: BlogStatus.PUBLISHED })
    .populate('author', 'name avatar');

  const queryStr = query as unknown as Record<string, string>;
  const blogQuery = new QueryBuilder(baseQuery, queryStr)
    .search(['title', 'content', 'tags'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.getMeta();

  return { result, meta };
};

// Get single blog by ID or slug
const getBlogByIdentifier = async (identifier: string) => {
  let blog;

  // Check if identifier is ObjectId
  if (Types.ObjectId.isValid(identifier)) {
    blog = await Blog.findOne({ 
      _id: identifier, 
      status: BlogStatus.PUBLISHED 
    }).populate('author', 'name avatar');
  } else {
    // Search by slug
    blog = await Blog.findOne({ 
      slug: identifier, 
      status: BlogStatus.PUBLISHED 
    }).populate('author', 'name avatar');
  }

  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  // Increment view count
  blog.viewCount += 1;
  await blog.save();

  return blog;
};

// Add comment to blog
const addComment = async (blogId: string, commentData: ICreateComment & { ipAddress?: string; userAgent?: string }) => {
  const blog = await Blog.findOne({ 
    _id: blogId, 
    status: BlogStatus.PUBLISHED 
  });

  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  // Add comment with pending status (needs approval)
  blog.comments.push({
    ...commentData,
    isApproved: false,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any);

  await blog.save();

  return blog.comments[blog.comments.length - 1]; // Return the newly added comment
};

// Get approved comments for a blog
const getBlogComments = async (blogId: string, query: Record<string, unknown>) => {
  const blog = await Blog.findOne({ 
    _id: blogId, 
    status: BlogStatus.PUBLISHED 
  });

  if (!blog) {
    throw new AppError(404, "Blog not found");
  }

  // Filter approved comments
  const approvedComments = blog.comments.filter(
    comment => comment.isApproved === true
  );

  // Simple pagination for comments
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const paginatedComments = approvedComments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(skip, skip + limit);

  const meta = {
    page,
    limit,
    total: approvedComments.length,
    totalPage: Math.ceil(approvedComments.length / limit)
  };

  return { result: paginatedComments, meta };
};

// ================== UTILITY SERVICES ==================

// Get featured blogs
const getFeaturedBlogs = async (limit: number = 5) => {
  return Blog.find({ 
    status: BlogStatus.PUBLISHED, 
    isFeatured: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

// Get recent blogs
const getRecentBlogs = async (limit: number = 5) => {
  return Blog.find({ status: BlogStatus.PUBLISHED })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

// Get popular blogs (by views)
const getPopularBlogs = async (limit: number = 5) => {
  return Blog.find({ status: BlogStatus.PUBLISHED })
    .sort({ views: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

export const BlogService = {
  // Admin services
  createBlog,
  getAllBlogsForAdmin,
  getBlogByIdForAdmin,
  updateBlog,
  deleteBlog,
  manageComment,
  
  // Public services
  getPublicBlogs,
  getBlogByIdentifier,
  addComment,
  getBlogComments,
  
  // Utility services
  getFeaturedBlogs,
  getRecentBlogs,
  getPopularBlogs
};

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

// Get comprehensive blog statistics
const getBlogStats = async () => {
  try {
    // Get all blogs for statistics
    const allBlogs = await Blog.find().populate('author', 'name email avatar');
    
    // Basic counts
    const totalBlogs = allBlogs.length;
    const publishedBlogs = allBlogs.filter(blog => blog.status === BlogStatus.PUBLISHED);
    const draftBlogs = allBlogs.filter(blog => blog.status === BlogStatus.DRAFT);
    const featuredBlogs = allBlogs.filter(blog => blog.isFeature === true);
    
    // Views and engagement
    const totalViews = allBlogs.reduce((sum, blog) => sum + (blog.viewCount || 0), 0);
    const totalComments = allBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0);
    const averageViews = totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;
    
    // Comments statistics
    const allComments = allBlogs.flatMap(blog => blog.comments || []);
    const approvedComments = allComments.filter(comment => comment.isApproved);
    const pendingComments = allComments.filter(comment => !comment.isApproved);
    
    // Category statistics
    const categoryStats = allBlogs.reduce((acc, blog) => {
      const category = blog.category;
      if (!acc[category]) {
        acc[category] = { count: 0, views: 0, comments: 0 };
      }
      acc[category].count += 1;
      acc[category].views += blog.viewCount || 0;
      acc[category].comments += blog.commentCount || 0;
      return acc;
    }, {} as Record<string, { count: number; views: number; comments: number }>);
    
    // Monthly statistics (last 12 months)
    const now = new Date();
    const monthlyStats = [];
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthBlogs = allBlogs.filter(blog => {
        const blogDate = new Date(blog.createdAt);
        return blogDate >= monthDate && blogDate < nextMonthDate;
      });
      
      const monthViews = monthBlogs.reduce((sum, blog) => sum + (blog.viewCount || 0), 0);
      const monthComments = monthBlogs.reduce((sum, blog) => sum + (blog.commentCount || 0), 0);
      
      monthlyStats.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        blogs: monthBlogs.length,
        views: monthViews,
        comments: monthComments,
        published: monthBlogs.filter(blog => blog.status === BlogStatus.PUBLISHED).length
      });
    }
    
    // Top performing blogs
    const topBlogsByViews = publishedBlogs
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10)
      .map(blog => ({
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        views: blog.viewCount || 0,
        comments: blog.commentCount || 0,
        category: blog.category,
        publishedAt: blog.publishedAt,
        author: blog.author
      }));
    
    // Recent activity (last 10 blogs)
    const recentActivity = allBlogs
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(blog => ({
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        status: blog.status,
        updatedAt: blog.updatedAt,
        author: blog.author
      }));
    
    // Tag statistics
    const tagStats = allBlogs.reduce((acc, blog) => {
      blog.tags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = { count: 0, views: 0 };
        }
        acc[tag].count += 1;
        acc[tag].views += blog.viewCount || 0;
      });
      return acc;
    }, {} as Record<string, { count: number; views: number }>);
    
    // Sort tags by usage
    const topTags = Object.entries(tagStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 20)
      .map(([tag, stats]) => ({ tag, ...stats }));
    
    // Author statistics (if multiple authors exist)
    const authorStats = allBlogs.reduce((acc, blog) => {
      // Ensure author is populated
      if (!blog.author || typeof blog.author === 'string') return acc;
      
      const authorId = blog.author._id.toString();
      const authorName = (blog.author as any).name || 'Unknown Author';
      
      if (!acc[authorId]) {
        acc[authorId] = {
          name: authorName,
          blogs: 0,
          views: 0,
          comments: 0,
          published: 0
        };
      }
      
      acc[authorId].blogs += 1;
      acc[authorId].views += blog.viewCount || 0;
      acc[authorId].comments += blog.commentCount || 0;
      if (blog.status === BlogStatus.PUBLISHED) {
        acc[authorId].published += 1;
      }
      
      return acc;
    }, {} as Record<string, { name: string; blogs: number; views: number; comments: number; published: number }>);
    
    return {
      overview: {
        totalBlogs,
        publishedBlogs: publishedBlogs.length,
        draftBlogs: draftBlogs.length,
        featuredBlogs: featuredBlogs.length,
        totalViews,
        totalComments: approvedComments.length,
        pendingComments: pendingComments.length,
        averageViews,
        averageComments: totalBlogs > 0 ? Math.round(approvedComments.length / totalBlogs) : 0
      },
      categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        ...stats
      })),
      monthlyStats,
      topBlogsByViews,
      recentActivity,
      topTags,
      authorStats: Object.entries(authorStats).map(([id, stats]) => ({
        authorId: id,
        ...stats
      })),
      engagement: {
        totalViews,
        totalComments: approvedComments.length,
        viewsToCommentsRatio: approvedComments.length > 0 ? Math.round(totalViews / approvedComments.length) : 0,
        averageViewsPerPost: averageViews,
        mostViewedCategory: Object.entries(categoryStats).reduce((max, [category, stats]) => 
          stats.views > (max.views || 0) ? { category, views: stats.views } : max, 
          { category: '', views: 0 }
        )
      }
    };
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    throw new AppError(500, 'Failed to fetch blog statistics');
  }
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
  
  // Analytics services
  getBlogStats,
  
  // Utility services
  getFeaturedBlogs,
  getRecentBlogs,
  getPopularBlogs
};

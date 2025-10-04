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
exports.BlogService = void 0;
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const blog_model_1 = require("./blog.model");
const blog_interface_1 = require("./blog.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// ================== ADMIN SERVICES ==================
// Create new blog
const createBlog = (blogData) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.create(Object.assign(Object.assign({}, blogData), { status: blog_interface_1.BlogStatus.PUBLISHED // Default to published for admin
     }));
    yield blog.populate('author', 'name email avatar');
    return blog;
});
// Get all blogs for admin (includes drafts)
const getAllBlogsForAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryStr = query;
    const blogQuery = new QueryBuilder_1.QueryBuilder(blog_model_1.Blog.find().populate('author', 'name email avatar'), queryStr)
        .search(['title', 'content', 'tags'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield blogQuery.modelQuery;
    const meta = yield blogQuery.getMeta();
    return { result, meta };
});
// Get single blog by ID for admin (includes drafts)
const getBlogByIdForAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findById(id).populate('author', 'name email avatar');
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    return blog;
});
// Update blog
const updateBlog = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findById(id);
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    const updated = yield blog_model_1.Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('author', 'name email avatar');
    return updated;
});
// Delete blog
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findById(id);
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    yield blog_model_1.Blog.findByIdAndDelete(id);
    return null;
});
// Manage comment (approve/reject)
const manageComment = (commentId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const isApproved = action === 'approve';
    const blog = yield blog_model_1.Blog.findOneAndUpdate({ 'comments._id': commentId }, { $set: { 'comments.$.isApproved': isApproved } }, { new: true });
    if (!blog) {
        throw new AppError_1.default(404, "Comment not found");
    }
    const comment = blog.comments.find(c => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
    return comment;
});
// ================== PUBLIC SERVICES ==================
// Get published blogs for public
const getPublicBlogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = blog_model_1.Blog.find({ status: blog_interface_1.BlogStatus.PUBLISHED })
        .populate('author', 'name avatar');
    const queryStr = query;
    const blogQuery = new QueryBuilder_1.QueryBuilder(baseQuery, queryStr)
        .search(['title', 'content', 'tags'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield blogQuery.modelQuery;
    const meta = yield blogQuery.getMeta();
    return { result, meta };
});
// Get single blog by ID or slug
const getBlogByIdentifier = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    let blog;
    // Check if identifier is ObjectId
    if (mongoose_1.Types.ObjectId.isValid(identifier)) {
        blog = yield blog_model_1.Blog.findOne({
            _id: identifier,
            status: blog_interface_1.BlogStatus.PUBLISHED
        }).populate('author', 'name avatar');
    }
    else {
        // Search by slug
        blog = yield blog_model_1.Blog.findOne({
            slug: identifier,
            status: blog_interface_1.BlogStatus.PUBLISHED
        }).populate('author', 'name avatar');
    }
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Increment view count
    blog.viewCount += 1;
    yield blog.save();
    return blog;
});
// Add comment to blog
const addComment = (blogId, commentData) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findOne({
        _id: blogId,
        status: blog_interface_1.BlogStatus.PUBLISHED
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Add comment with pending status (needs approval)
    blog.comments.push(Object.assign(Object.assign({}, commentData), { isApproved: false, createdAt: new Date(), updatedAt: new Date() }));
    yield blog.save();
    return blog.comments[blog.comments.length - 1]; // Return the newly added comment
});
// Get approved comments for a blog
const getBlogComments = (blogId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findOne({
        _id: blogId,
        status: blog_interface_1.BlogStatus.PUBLISHED
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Filter approved comments
    const approvedComments = blog.comments.filter(comment => comment.isApproved === true);
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
});
// Get comprehensive blog statistics
const getBlogStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all blogs for statistics
        const allBlogs = yield blog_model_1.Blog.find().populate('author', 'name email avatar');
        // Basic counts
        const totalBlogs = allBlogs.length;
        const publishedBlogs = allBlogs.filter(blog => blog.status === blog_interface_1.BlogStatus.PUBLISHED);
        const draftBlogs = allBlogs.filter(blog => blog.status === blog_interface_1.BlogStatus.DRAFT);
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
        }, {});
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
                published: monthBlogs.filter(blog => blog.status === blog_interface_1.BlogStatus.PUBLISHED).length
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
        }, {});
        // Sort tags by usage
        const topTags = Object.entries(tagStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 20)
            .map(([tag, stats]) => (Object.assign({ tag }, stats)));
        // Author statistics (if multiple authors exist)
        const authorStats = allBlogs.reduce((acc, blog) => {
            // Ensure author is populated
            if (!blog.author || typeof blog.author === 'string')
                return acc;
            const authorId = blog.author._id.toString();
            const authorName = blog.author.name || 'Unknown Author';
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
            if (blog.status === blog_interface_1.BlogStatus.PUBLISHED) {
                acc[authorId].published += 1;
            }
            return acc;
        }, {});
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
            categoryStats: Object.entries(categoryStats).map(([category, stats]) => (Object.assign({ category }, stats))),
            monthlyStats,
            topBlogsByViews,
            recentActivity,
            topTags,
            authorStats: Object.entries(authorStats).map(([id, stats]) => (Object.assign({ authorId: id }, stats))),
            engagement: {
                totalViews,
                totalComments: approvedComments.length,
                viewsToCommentsRatio: approvedComments.length > 0 ? Math.round(totalViews / approvedComments.length) : 0,
                averageViewsPerPost: averageViews,
                mostViewedCategory: Object.entries(categoryStats).reduce((max, [category, stats]) => stats.views > (max.views || 0) ? { category, views: stats.views } : max, { category: '', views: 0 })
            }
        };
    }
    catch (error) {
        console.error('Error fetching blog stats:', error);
        throw new AppError_1.default(500, 'Failed to fetch blog statistics');
    }
});
// ================== UTILITY SERVICES ==================
// Get featured blogs
const getFeaturedBlogs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 5) {
    return blog_model_1.Blog.find({
        status: blog_interface_1.BlogStatus.PUBLISHED,
        isFeatured: true
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('author', 'name avatar');
});
// Get recent blogs
const getRecentBlogs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 5) {
    return blog_model_1.Blog.find({ status: blog_interface_1.BlogStatus.PUBLISHED })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('author', 'name avatar');
});
// Get popular blogs (by views)
const getPopularBlogs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 5) {
    return blog_model_1.Blog.find({ status: blog_interface_1.BlogStatus.PUBLISHED })
        .sort({ views: -1 })
        .limit(limit)
        .populate('author', 'name avatar');
});
exports.BlogService = {
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

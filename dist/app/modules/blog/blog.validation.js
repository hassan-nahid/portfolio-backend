"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const blog_interface_1 = require("./blog.interface");
// Create blog validation schema (Admin only)
const createBlogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            message: "Blog title is required"
        }).min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters"),
        excerpt: zod_1.z.string({
            message: "Blog excerpt is required"
        }).min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters"),
        content: zod_1.z.string({
            message: "Blog content is required"
        }).min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters"),
        category: zod_1.z.string().refine((val) => Object.values(blog_interface_1.BlogCategory).includes(val), {
            message: "Please select a valid blog category"
        }),
        tags: zod_1.z.union([
            zod_1.z.array(zod_1.z.string()).min(1, "At least one tag is required").max(10, "Cannot have more than 10 tags"),
            zod_1.z.string().transform((str) => {
                try {
                    const parsed = JSON.parse(str);
                    if (Array.isArray(parsed))
                        return parsed;
                    return [str];
                }
                catch (_a) {
                    return str.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                }
            })
        ]).refine((tags) => Array.isArray(tags) && tags.length >= 1 && tags.length <= 10, {
            message: "Must have 1-10 tags"
        }),
        status: zod_1.z.union([
            zod_1.z.nativeEnum(blog_interface_1.BlogStatus),
            zod_1.z.string().refine((val) => Object.values(blog_interface_1.BlogStatus).includes(val), {
                message: "Please select a valid blog status"
            })
        ]).optional(),
        isFeature: zod_1.z.union([
            zod_1.z.boolean(),
            zod_1.z.string().transform((val) => val === 'true' || val === '1')
        ]).optional()
    }).optional()
}).passthrough();
// Update blog validation schema (Admin only)
const updateBlogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters").optional(),
        excerpt: zod_1.z.string().min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters").optional(),
        content: zod_1.z.string().min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters").optional(),
        category: zod_1.z.nativeEnum(blog_interface_1.BlogCategory, {
            message: "Please select a valid blog category"
        }).optional(),
        tags: zod_1.z.array(zod_1.z.string().trim().min(1, "Tag cannot be empty").max(50, "Tag cannot exceed 50 characters"))
            .min(1, "At least one tag is required")
            .max(10, "Cannot have more than 10 tags").optional(),
        status: zod_1.z.nativeEnum(blog_interface_1.BlogStatus, {
            message: "Please select a valid blog status"
        }).optional(),
        isFeature: zod_1.z.boolean().optional()
    }).optional() // Make entire body optional to allow photo-only updates
}).passthrough(); // Allow additional fields like file metadata
// Comment validation schema (Public)
const createCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        author: zod_1.z.string({
            message: "Author name is required"
        }).trim().min(2, "Author name must be at least 2 characters long").max(100, "Author name cannot exceed 100 characters"),
        email: zod_1.z.string({
            message: "Email is required"
        }).email("Please provide a valid email address"),
        website: zod_1.z.string().url("Please provide a valid website URL").optional().or(zod_1.z.literal("")),
        content: zod_1.z.string({
            message: "Comment content is required"
        }).trim().min(5, "Comment must be at least 5 characters long").max(1000, "Comment cannot exceed 1000 characters")
    })
});
exports.BlogValidation = {
    createBlogValidationSchema,
    updateBlogValidationSchema,
    createCommentValidationSchema
};

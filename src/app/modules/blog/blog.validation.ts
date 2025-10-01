import { z } from "zod";
import { BlogStatus, BlogCategory } from "./blog.interface";

// Create blog validation schema (Admin only)
const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: "Blog title is required"
    }).min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters"),
    
    excerpt: z.string({
      message: "Blog excerpt is required"
    }).min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters"),
    
    content: z.string({
      message: "Blog content is required"
    }).min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters"),
    
    category: z.nativeEnum(BlogCategory, {
      message: "Please select a valid blog category"
    }),
    
    tags: z.array(z.string({
      message: "Tag must be a string"
    }).trim().min(1, "Tag cannot be empty").max(50, "Tag cannot exceed 50 characters"))
      .min(1, "At least one tag is required")
      .max(10, "Cannot have more than 10 tags"),
    
    status: z.nativeEnum(BlogStatus, {
      message: "Please select a valid blog status"
    }).optional(),
    
    isFeature: z.boolean().optional()
  })
});

// Update blog validation schema (Admin only)
const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters").optional(),
    
    excerpt: z.string().min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters").optional(),
    
    content: z.string().min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters").optional(),
    
    category: z.nativeEnum(BlogCategory, {
      message: "Please select a valid blog category"
    }).optional(),
    
    tags: z.array(z.string().trim().min(1, "Tag cannot be empty").max(50, "Tag cannot exceed 50 characters"))
      .min(1, "At least one tag is required")
      .max(10, "Cannot have more than 10 tags").optional(),
    
    status: z.nativeEnum(BlogStatus, {
      message: "Please select a valid blog status"
    }).optional(),
    
    isFeature: z.boolean().optional()
  }).optional() // Make entire body optional to allow photo-only updates
}).passthrough(); // Allow additional fields like file metadata

// Comment validation schema (Public)
const createCommentValidationSchema = z.object({
  body: z.object({
    author: z.string({
      message: "Author name is required"
    }).trim().min(2, "Author name must be at least 2 characters long").max(100, "Author name cannot exceed 100 characters"),
    
    email: z.string({
      message: "Email is required"
    }).email("Please provide a valid email address"),
    
    website: z.string().url("Please provide a valid website URL").optional().or(z.literal("")),
    
    content: z.string({
      message: "Comment content is required"
    }).trim().min(5, "Comment must be at least 5 characters long").max(1000, "Comment cannot exceed 1000 characters")
  })
});

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
  createCommentValidationSchema
};

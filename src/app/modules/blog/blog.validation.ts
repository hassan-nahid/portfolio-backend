import { z } from "zod";
import { BlogStatus, BlogCategory } from "./blog.interface";

// Blog tag validation schema
const blogTagSchema = z.object({
  name: z.string({
    message: "Tag name is required"
  }).min(1, "Tag name cannot be empty").max(50, "Tag name cannot exceed 50 characters"),
  
  slug: z.string({
    message: "Tag slug is required"
  }).min(1, "Tag slug cannot be empty").max(50, "Tag slug cannot exceed 50 characters")
    .regex(/^[a-z0-9-]+$/, "Tag slug can only contain lowercase letters, numbers, and hyphens"),
  
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color").optional()
});

// Blog SEO validation schema
const blogSEOSchema = z.object({
  metaTitle: z.string().max(60, "Meta title cannot exceed 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description cannot exceed 160 characters").optional(),
  keywords: z.array(z.string().max(50, "Each keyword cannot exceed 50 characters")).max(10, "Cannot have more than 10 keywords").optional(),
  ogImage: z.string().url("OG image must be a valid URL").optional(),
  canonicalUrl: z.string().url("Canonical URL must be a valid URL").optional()
});

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
    
    featuredImage: z.string().url("Featured image must be a valid URL").optional(),
    
    gallery: z.array(z.string().url("Each gallery image must be a valid URL")).max(10, "Cannot have more than 10 gallery images").optional(),
    
    category: z.nativeEnum(BlogCategory, {
      message: "Please select a valid blog category"
    }),
    
    tags: z.array(blogTagSchema)
      .min(1, "At least one tag is required")
      .max(5, "Cannot have more than 5 tags"),
    
    status: z.nativeEnum(BlogStatus, {
      message: "Please select a valid blog status"
    }).optional(),
    
    isFeature: z.boolean().optional(),
    
    isPinned: z.boolean().optional(),
    
    seo: blogSEOSchema.optional(),
    
    publishedAt: z.string().datetime("Invalid datetime format").optional(),
    
    scheduledAt: z.string().datetime("Invalid datetime format").optional()
  })
});

// Update blog validation schema (Admin only)
const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters").optional(),
    
    excerpt: z.string().min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters").optional(),
    
    content: z.string().min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters").optional(),
    
    featuredImage: z.string().url("Featured image must be a valid URL").optional(),
    
    gallery: z.array(z.string().url("Each gallery image must be a valid URL")).max(10, "Cannot have more than 10 gallery images").optional(),
    
    category: z.nativeEnum(BlogCategory, {
      message: "Please select a valid blog category"
    }).optional(),
    
    tags: z.array(blogTagSchema)
      .min(1, "At least one tag is required")
      .max(5, "Cannot have more than 5 tags").optional(),
    
    status: z.nativeEnum(BlogStatus, {
      message: "Please select a valid blog status"
    }).optional(),
    
    isFeature: z.boolean().optional(),
    
    isPinned: z.boolean().optional(),
    
    seo: blogSEOSchema.optional(),
    
    publishedAt: z.string().datetime("Invalid datetime format").optional(),
    
    scheduledAt: z.string().datetime("Invalid datetime format").optional()
  }).optional() // Make entire body optional to allow file-only updates
}).passthrough(); // Allow additional fields like file metadata

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema
};

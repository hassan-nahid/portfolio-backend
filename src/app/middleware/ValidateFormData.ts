import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Custom validation middleware for form-data with multer
export const validateFormData = (schema: z.ZodSchema<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };

// Blog form data validation schema
const blogFormDataSchema = z.object({
  title: z.string({
    message: "Blog title is required"
  }).min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters"),
  
  excerpt: z.string({
    message: "Blog excerpt is required"
  }).min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters"),
  
  content: z.string({
    message: "Blog content is required"
  }).min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters"),
  
  category: z.string().refine((val) => {
    const validCategories = ["Technology", "Web Development", "Programming", "Tutorial", "Personal", "Other"];
    return validCategories.includes(val);
  }, {
    message: "Please select a valid blog category (Technology, Web Development, Programming, Tutorial, Personal, Other)"
  }),
  
  tags: z.union([
    z.array(z.string()),
    z.string().transform((str) => {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed;
        return [str];
      } catch {
        return str.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    })
  ]).refine((tags) => Array.isArray(tags) && tags.length >= 1 && tags.length <= 10, {
    message: "Must have 1-10 tags"
  }),
  
  status: z.string().refine((val) => {
    const validStatuses = ["draft", "published", "archived"];
    return validStatuses.includes(val.toLowerCase());
  }, {
    message: "Status must be: draft, published, or archived"
  }).transform(val => val.toLowerCase()).optional().default("published"),
  
  isFeature: z.union([
    z.boolean(),
    z.string().transform((val) => val === 'true' || val === '1' || val === 'yes')
  ]).optional().default(false)
});

export const validateBlogFormData = validateFormData(blogFormDataSchema);
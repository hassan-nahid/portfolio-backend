import { z } from "zod";

const createAboutValidationSchema = z.object({
    name: z.string({
      message: "Name is required"
    }).min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters"),
    
    about: z.string({
      message: "About description is required"
    }).min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters"),
    
    bio: z.string({
      message: "Bio is required"
    }).min(10, "Bio must be at least 10 characters long").max(200, "Bio cannot exceed 200 characters"),
    
    experience: z.number({
      message: "Experience is required"
    }).int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years"),
    
    projects: z.number({
      message: "Number of projects is required"
    }).int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic")
});

const updateAboutValidationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters").optional(),
    
    about: z.string().min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters").optional(),
    bio: z.string().min(10, "About description must be at least 10 characters long").max(200, "About description cannot exceed 2000 characters").optional(),
    
    experience: z.number().int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years").optional(),
    
    projects: z.number().int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic").optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export const AboutValidation = {
  createAboutValidationSchema,
  updateAboutValidationSchema
};





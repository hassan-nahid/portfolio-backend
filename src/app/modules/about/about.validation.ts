import { z } from "zod";

const createAboutValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Name is required"
    }).min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters"),

    about: z.string({
      message: "About description is required"
    }).min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters"),

    bio: z.string({
      message: "Bio is required"
    }).min(10, "Bio must be at least 10 characters long").max(1000, "Bio cannot exceed 1000 characters"),

    experience: z.number({
      message: "Experience is required"
    }).int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years"),

    projects: z.number({
      message: "Number of projects is required"
    }).int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic")
  })
});

// More flexible update validation that allows photo-only updates
const updateAboutValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters").optional(),

    about: z.string().min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters").optional(),

    bio: z.string().min(10, "Bio must be at least 10 characters long").max(1000, "Bio cannot exceed 1000 characters").optional(),

    experience: z.number().int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years").optional(),

    projects: z.number().int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic").optional()
  }).optional() // Make the entire body optional to allow photo-only updates
}).passthrough(); // Allow additional fields (like file metadata) to pass through

export const AboutValidation = {
  createAboutValidationSchema,
  updateAboutValidationSchema
};





"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutValidation = void 0;
const zod_1 = require("zod");
const createAboutValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: "Name is required"
        }).min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters"),
        about: zod_1.z.string({
            message: "About description is required"
        }).min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters"),
        bio: zod_1.z.string({
            message: "Bio is required"
        }).min(10, "Bio must be at least 10 characters long").max(1000, "Bio cannot exceed 1000 characters"),
        experience: zod_1.z.number({
            message: "Experience is required"
        }).int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years"),
        projects: zod_1.z.number({
            message: "Number of projects is required"
        }).int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic")
    })
});
// More flexible update validation that allows photo-only updates
const updateAboutValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters").optional(),
        about: zod_1.z.string().min(10, "About description must be at least 10 characters long").max(2000, "About description cannot exceed 2000 characters").optional(),
        bio: zod_1.z.string().min(10, "Bio must be at least 10 characters long").max(1000, "Bio cannot exceed 1000 characters").optional(),
        experience: zod_1.z.number().int("Experience must be a whole number").min(0, "Experience cannot be negative").max(50, "Experience cannot exceed 50 years").optional(),
        projects: zod_1.z.number().int("Projects must be a whole number").min(0, "Projects cannot be negative").max(10000, "Projects count seems unrealistic").optional()
    }).optional() // Make the entire body optional to allow photo-only updates
}).passthrough(); // Allow additional fields (like file metadata) to pass through
exports.AboutValidation = {
    createAboutValidationSchema,
    updateAboutValidationSchema
};

import { z } from 'zod';

// Create project validation
const createProjectValidationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    image: z.string().optional(), // Optional since multer handles file upload or URL can be provided
    category: z.string().refine((val) => ['WEB', 'MOBILE', 'DESKTOP'].includes(val), {
        message: 'Category must be WEB, MOBILE, or DESKTOP'
    }),
    description: z.string().min(1, 'Description is required'),
    features: z.union([
        z.array(z.string().min(1, 'Feature cannot be empty')),
        z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                return Array.isArray(parsed) ? parsed.filter(f => f.trim().length > 0) : [];
            } catch {
                return str.split(',').map(f => f.trim()).filter(f => f.length > 0);
            }
        })
    ]).optional(),
    demoLink: z.string().optional(),
    githubFrontend: z.string().optional(),
    githubBackend: z.string().optional(),
    githubFullStack: z.string().optional(),
    stacks: z.union([
        z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")),
        z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                if (Array.isArray(parsed)) {
                    // Validate each ObjectId
                    return parsed.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
                }
                // Single ObjectId
                if (/^[0-9a-fA-F]{24}$/.test(str.trim())) {
                    return [str.trim()];
                }
                return [];
            } catch {
                // Comma separated ObjectIds
                return str.split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F]{24}$/.test(id));
            }
        })
    ]).optional().default([]),
});

// Update project validation
const updateProjectValidationSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    image: z.string().optional(),
    category: z.string().refine((val) => ['WEB', 'MOBILE', 'DESKTOP'].includes(val), {
        message: 'Category must be WEB, MOBILE, or DESKTOP'
    }).optional(),
    description: z.string().min(1, 'Description is required').optional(),
    features: z.union([
        z.array(z.string().min(1, 'Feature cannot be empty')),
        z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                return Array.isArray(parsed) ? parsed.filter(f => f.trim().length > 0) : [];
            } catch {
                return str.split(',').map(f => f.trim()).filter(f => f.length > 0);
            }
        })
    ]).optional(),
    demoLink: z.string().optional(),
    githubFrontend: z.string().optional(),
    githubBackend: z.string().optional(),
    githubFullStack: z.string().optional(),
    stacks: z.union([
        z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")),
        z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                if (Array.isArray(parsed)) {
                    // Validate each ObjectId
                    return parsed.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
                }
                // Single ObjectId
                if (/^[0-9a-fA-F]{24}$/.test(str.trim())) {
                    return [str.trim()];
                }
                return [];
            } catch {
                // Comma separated ObjectIds
                return str.split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F]{24}$/.test(id));
            }
        })
    ]).optional(),
});

export const ProjectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
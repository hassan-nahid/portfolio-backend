"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
// Create project validation
const createProjectValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    image: zod_1.z.string().optional(), // Optional since multer handles file upload or URL can be provided
    category: zod_1.z.string().refine((val) => ['WEB', 'MOBILE', 'DESKTOP'].includes(val), {
        message: 'Category must be WEB, MOBILE, or DESKTOP'
    }),
    description: zod_1.z.string().min(1, 'Description is required'),
    features: zod_1.z.union([
        zod_1.z.array(zod_1.z.string().min(1, 'Feature cannot be empty')),
        zod_1.z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                return Array.isArray(parsed) ? parsed.filter(f => f.trim().length > 0) : [];
            }
            catch (_a) {
                return str.split(',').map(f => f.trim()).filter(f => f.length > 0);
            }
        })
    ]).optional(),
    demoLink: zod_1.z.string().optional(),
    githubFrontend: zod_1.z.string().optional(),
    githubBackend: zod_1.z.string().optional(),
    githubFullStack: zod_1.z.string().optional(),
    stacks: zod_1.z.union([
        zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")),
        zod_1.z.string().transform((str) => {
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
            }
            catch (_a) {
                // Comma separated ObjectIds
                return str.split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F]{24}$/.test(id));
            }
        })
    ]).optional().default([]),
});
// Update project validation
const updateProjectValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    image: zod_1.z.string().optional(),
    category: zod_1.z.string().refine((val) => ['WEB', 'MOBILE', 'DESKTOP'].includes(val), {
        message: 'Category must be WEB, MOBILE, or DESKTOP'
    }).optional(),
    description: zod_1.z.string().min(1, 'Description is required').optional(),
    features: zod_1.z.union([
        zod_1.z.array(zod_1.z.string().min(1, 'Feature cannot be empty')),
        zod_1.z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                return Array.isArray(parsed) ? parsed.filter(f => f.trim().length > 0) : [];
            }
            catch (_a) {
                return str.split(',').map(f => f.trim()).filter(f => f.length > 0);
            }
        })
    ]).optional(),
    demoLink: zod_1.z.string().optional(),
    githubFrontend: zod_1.z.string().optional(),
    githubBackend: zod_1.z.string().optional(),
    githubFullStack: zod_1.z.string().optional(),
    stacks: zod_1.z.union([
        zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")),
        zod_1.z.string().transform((str) => {
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
            }
            catch (_a) {
                // Comma separated ObjectIds
                return str.split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F]{24}$/.test(id));
            }
        })
    ]).optional(),
});
exports.ProjectValidation = {
    createProjectValidationSchema,
    updateProjectValidationSchema,
};

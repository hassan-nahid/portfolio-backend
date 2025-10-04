"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillValidation = void 0;
const zod_1 = require("zod");
// Skill level enum validation
const skillLevelEnum = zod_1.z.enum([
    'Beginner',
    'Intermediate',
    'Experienced',
    'Expert',
    'Good',
    'Strong',
    'Excellent'
], {
    message: 'Level must be one of: Beginner, Intermediate, Experienced, Expert, Good, Strong, Excellent'
});
// Create skill validation
const createSkillValidationSchema = zod_1.z.object({
    skill: zod_1.z.string().min(1, 'Skill name is required'),
    level: skillLevelEnum,
    logo: zod_1.z.string().optional(), // Optional since multer handles file upload or URL can be provided
    category: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
});
// Update skill validation
const updateSkillValidationSchema = zod_1.z.object({
    skill: zod_1.z.string().min(1, 'Skill name is required').optional(),
    level: skillLevelEnum.optional(),
    logo: zod_1.z.string().optional(),
    category: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format').optional(),
});
exports.SkillValidation = {
    createSkillValidationSchema,
    updateSkillValidationSchema,
};

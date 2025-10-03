import { z } from 'zod';

// Skill level enum validation
const skillLevelEnum = z.enum([
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
const createSkillValidationSchema = z.object({
    skill: z.string().min(1, 'Skill name is required'),
    level: skillLevelEnum,
    logo: z.string().optional(), // Optional since multer handles file upload or URL can be provided
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
});

// Update skill validation
const updateSkillValidationSchema = z.object({
    skill: z.string().min(1, 'Skill name is required').optional(),
    level: skillLevelEnum.optional(),
    logo: z.string().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format').optional(),
});

export const SkillValidation = {
  createSkillValidationSchema,
  updateSkillValidationSchema,
};

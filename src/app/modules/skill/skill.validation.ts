import { z } from 'zod';

// Create skill validation
const createSkillValidationSchema = z.object({
  body: z.object({
    skill: z.string().min(1, 'Skill name is required'),
    level: z.string().min(1, 'Level is required'),
    logo: z.string().min(1, 'Logo is required'),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
  }),
});

// Update skill validation
const updateSkillValidationSchema = z.object({
  body: z.object({
    skill: z.string().min(1, 'Skill name is required').optional(),
    level: z.string().min(1, 'Level is required').optional(),
    logo: z.string().min(1, 'Logo is required').optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format').optional(),
  }),
});

export const SkillValidation = {
  createSkillValidationSchema,
  updateSkillValidationSchema,
};

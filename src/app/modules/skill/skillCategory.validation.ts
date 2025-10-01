import { z } from 'zod';

// Create skill category validation
const createSkillCategoryValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
  }),
});

// Update skill category validation
const updateSkillCategoryValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
  }),
});

export const SkillCategoryValidation = {
  createSkillCategoryValidationSchema,
  updateSkillCategoryValidationSchema,
};
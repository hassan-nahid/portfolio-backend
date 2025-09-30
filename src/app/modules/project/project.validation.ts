import { z } from 'zod';

// Create project validation
const createProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    image: z.string().min(1, 'Image is required'),
    category: z.enum(['WEB', 'MOBILE', 'DESKTOP']),
    description: z.string().min(1, 'Description is required'),
    demoLink: z.string().optional(),
    githubFrontend: z.string().optional(),
    githubBackend: z.string().optional(),
    stacks: z.array(z.string()).min(1, 'At least one stack is required'),
  }),
});

// Update project validation
const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    image: z.string().min(1, 'Image is required').optional(),
    category: z.enum(['WEB', 'MOBILE', 'DESKTOP']).optional(),
    description: z.string().min(1, 'Description is required').optional(),
    demoLink: z.string().optional(),
    githubFrontend: z.string().optional(),
    githubBackend: z.string().optional(),
    stacks: z.array(z.string()).min(1, 'At least one stack is required').optional(),
  }),
});

export const ProjectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
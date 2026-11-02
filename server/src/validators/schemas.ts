import { z } from 'zod';

export const projectStatusEnum = z.enum(['Active', 'Completed', 'On Hold']);
export const taskStatusEnum = z.enum(['Pending', 'In Progress', 'Completed']);

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer')
});

export const projectTaskParamSchema = z.object({
  projectId: z.coerce.number().int().positive('Project ID must be a positive integer')
});

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  status: projectStatusEnum.default('Active'),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in ISO format (YYYY-MM-DD)')
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  status: projectStatusEnum.optional()
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(2000).optional().default(''),
  status: taskStatusEnum.optional().default('Pending'),
  completed: z.boolean().optional()
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusEnum.optional(),
  completed: z.boolean().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

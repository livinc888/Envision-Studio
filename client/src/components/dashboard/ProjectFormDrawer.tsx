import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '../../services/api';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { AlertCircle, Calendar } from 'lucide-react';

const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long')
    .max(2000, 'Description cannot exceed 2000 characters'),
  status: z.enum(['Active', 'Completed', 'On Hold']),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format')
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: Project | null;
  isLoading?: boolean;
  serverError?: string | null;
}

export const ProjectFormDrawer: React.FC<ProjectFormDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  serverError
}) => {
  const defaultDeadline = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Active',
      deadline: defaultDeadline
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        deadline: initialData.deadline
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'Active',
        deadline: defaultDeadline
      });
    }
  }, [initialData, isOpen, reset, defaultDeadline]);

  // Focus the first invalid field on submission error
  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof ProjectFormData | undefined;
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  const onValidSubmit = async (data: ProjectFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch {
      // Handled by parent or toast
    }
  };

  const isSaving = isSubmitting || isLoading;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Studio Project' : 'New Creative Brief'}
      description={
        initialData
          ? `Modifying parameters for PRJ-${String(initialData.id).padStart(3, '0')}`
          : 'Establish delivery scope and milestone timeline for client release'
      }
    >
      <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="project-title" className="block text-xs font-mono uppercase text-zinc-400">
            Project Title *
          </label>
          <input
            id="project-title"
            type="text"
            placeholder="e.g. Next-Gen Mobile Banking"
            {...register('title')}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
              errors.title
                ? 'border-studio-red focus:border-studio-red ring-1 ring-studio-red/30'
                : 'border-white/10 focus:border-studio-red'
            }`}
          />
          {errors.title && (
            <p className="text-[11px] font-mono text-studio-red flex items-center gap-1 mt-1">
              <span>•</span> {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="project-desc" className="block text-xs font-mono uppercase text-zinc-400">
            Description &amp; Deliverables *
          </label>
          <textarea
            id="project-desc"
            rows={4}
            placeholder="Outline strategic goals, target audience, and architecture specifications..."
            {...register('description')}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all resize-none ${
              errors.description
                ? 'border-studio-red focus:border-studio-red ring-1 ring-studio-red/30'
                : 'border-white/10 focus:border-studio-red'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] font-mono text-studio-red flex items-center gap-1 mt-1">
              <span>•</span> {errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label htmlFor="project-status" className="block text-xs font-mono uppercase text-zinc-400">
            Initial Status
          </label>
          <select
            id="project-status"
            {...register('status')}
            className="w-full px-4 py-2.5 rounded-xl bg-[#18181B] border border-white/10 text-sm text-white focus:outline-none focus:border-studio-red transition-all cursor-pointer"
          >
            <option value="Active">Active (In Flight)</option>
            <option value="Completed">Completed (Shipped)</option>
            <option value="On Hold">On Hold (Pending Client)</option>
          </select>
          {errors.status && (
            <p className="text-[11px] font-mono text-studio-red flex items-center gap-1 mt-1">
              <span>•</span> {errors.status.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div className="space-y-1.5">
          <label htmlFor="project-deadline" className="block text-xs font-mono uppercase text-zinc-400">
            Target Deadline (YYYY-MM-DD) *
          </label>
          <div className="relative">
            <input
              id="project-deadline"
              type="date"
              {...register('deadline')}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                errors.deadline
                  ? 'border-studio-red focus:border-studio-red ring-1 ring-studio-red/30'
                  : 'border-white/10 focus:border-studio-red'
              }`}
            />
            <Calendar className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
          {errors.deadline && (
            <p className="text-[11px] font-mono text-studio-red flex items-center gap-1 mt-1">
              <span>•</span> {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
          >
            {initialData ? 'Save Changes' : 'Initialize Project'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

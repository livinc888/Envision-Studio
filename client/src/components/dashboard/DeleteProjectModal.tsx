import React, { useState } from 'react';
import type { Project } from '../../services/api';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: (projectId: number) => Promise<void>;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onConfirm
}) => {
  const [loading, setLoading] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm(project.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">This action cannot be undone.</p>
            <p className="text-zinc-400">
              Deleting <span className="text-white font-semibold">{project.title}</span> (PRJ-
              {String(project.id).padStart(3, '0')}) will permanently delete the project and all{' '}
              <span className="text-white font-semibold">{project.taskCount} associated tasks</span> via
              database cascade.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            Confirm Deletion
          </Button>
        </div>
      </div>
    </Modal>
  );
};


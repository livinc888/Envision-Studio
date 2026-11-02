import React, { useState } from 'react';
import type { Task } from '../../services/api';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Plus, Trash2, Check, Edit2, Clock } from 'lucide-react';

interface TaskPanelProps {
  projectId: number;
  tasks: Task[];
  onAddTask: (task: { title: string; description?: string; status: 'Pending' | 'In Progress' | 'Completed'; completed: boolean }) => Promise<void>;
  onToggleTask: (taskId: number, currentCompleted: boolean) => Promise<void>;
  onUpdateTask: (taskId: number, data: { title?: string; status?: 'Pending' | 'In Progress' | 'Completed' }) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'Completed') return t.completed;
    if (activeTab === 'Pending') return !t.completed;
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsAdding(true);
      await onAddTask({
        title: newTitle.trim(),
        description: newDesc.trim(),
        status: newStatus,
        completed: newStatus === 'Completed'
      });
      setNewTitle('');
      setNewDesc('');
      setNewStatus('Pending');
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (taskId: number) => {
    if (!editTitle.trim()) return;
    await onUpdateTask(taskId, { title: editTitle.trim() });
    setEditingTaskId(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-studio-cardDark border border-white/10 shadow-card-dark">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            Project Tasks
            <span className="text-xs font-mono text-zinc-400 font-normal">
              ({completedCount}/{tasks.length} Completed)
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Track deliverables and execution milestones</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {(['All', 'Pending', 'Completed'] as const).map((tab) => {
            const count = tab === 'All' ? tasks.length : tab === 'Pending' ? pendingCount : completedCount;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-studio-red text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-white/5'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="mt-4 divide-y divide-white/5 max-h-[460px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No tasks found in the &ldquo;{activeTab}&rdquo; view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="py-3 px-2 flex items-start justify-between gap-3 group hover:bg-white/[0.02] rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Animated Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id, task.completed)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    task.completed
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-white/20 hover:border-studio-red bg-white/5'
                  }`}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-black border border-studio-red text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="px-2 py-1 bg-studio-red text-white text-xs rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p
                        className={`text-sm tracking-tight transition-all duration-200 ${
                          task.completed
                            ? 'line-through text-zinc-500 decoration-zinc-500'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge status={task.status} size="sm" />

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
                    title="Edit Title"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Quick Form */}
      <form onSubmit={handleCreateTask} className="mt-6 pt-4 border-t border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new deliverable milestone..."
            required
            className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-studio-red"
          />

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#161618] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-studio-red"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <Button type="submit" size="sm" variant="primary" loading={isAdding} className="text-xs shrink-0">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>

        <input
          type="text"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Optional task notes or link (optional)"
          className="w-full px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-400 placeholder-zinc-600 text-[11px] focus:outline-none focus:border-white/20"
        />
      </form>
    </div>
  );
};

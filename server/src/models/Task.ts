import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    projectId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    completed: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);


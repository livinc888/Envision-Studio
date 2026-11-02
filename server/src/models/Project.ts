import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  deadline: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'On Hold'],
      default: 'Active',
      index: true
    },
    deadline: { type: String, required: true }
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

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);


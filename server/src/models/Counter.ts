import mongoose, { Schema } from 'mongoose';

export interface ICounter {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

export const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);

export async function getNextSequence(name: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return (counter as any).seq;
}

export async function setSequence(name: string, value: number): Promise<void> {
  await Counter.findByIdAndUpdate(
    name,
    { $set: { seq: value } },
    { new: true, upsert: true }
  );
}

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    passwordHash: string;
}

const AdminSchema = new Schema<IAdmin>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

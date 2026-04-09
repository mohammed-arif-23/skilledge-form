import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
    formId: mongoose.Types.ObjectId;
    responses: Record<string, any>;
    createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
        responses: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

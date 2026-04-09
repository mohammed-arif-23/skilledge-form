import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormField {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

export interface IForm extends Document {
    title: string;
    description?: string;
    slug: string;
    status: 'draft' | 'published';
    fields: IFormField[];
    createdAt: Date;
    updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: [{ type: String }]
});

const FormSchema = new Schema<IForm>(
    {
        title: { type: String, required: true },
        description: { type: String },
        slug: { type: String, required: true, unique: true },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        fields: [FormFieldSchema],
    },
    { timestamps: true }
);

export const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);

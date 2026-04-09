'use server';

import dbConnect from "@/lib/mongoose";
import { Form } from "@/models/Form";
import { Submission } from "@/models/Submission";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

async function isAuth() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
}

export async function getForms() {
    await isAuth();
    await dbConnect();

    const forms = await Form.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(forms));
}

export async function getForm(id: string) {
    await isAuth();
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid id");
    const form = await Form.findById(id).lean();
    return JSON.parse(JSON.stringify(form));
}

export async function saveForm(data: any) {
    await isAuth();
    await dbConnect();

    if (data._id) {
        const updated = await Form.findByIdAndUpdate(data._id, data, { new: true }).lean();
        return JSON.parse(JSON.stringify(updated));
    } else {
        const form = await Form.create(data);
        return JSON.parse(JSON.stringify(form));
    }
}

export async function deleteForm(id: string) {
    await isAuth();
    await dbConnect();

    await Form.findByIdAndDelete(id);
    await Submission.deleteMany({ formId: id });
    return { success: true };
}

export async function getSubmissions(formId: string) {
    await isAuth();
    await dbConnect();

    const submissions = await Submission.find({ formId }).sort({ createdAt: -1 }).lean();
    const form = await Form.findById(formId).lean();

    return {
        submissions: JSON.parse(JSON.stringify(submissions)),
        form: JSON.parse(JSON.stringify(form))
    };
}

export async function deleteSubmission(submissionId: string) {
    await isAuth();
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(submissionId)) throw new Error("Invalid submission id");
    await Submission.findByIdAndDelete(submissionId);
    return { success: true };
}

export async function submitFormBySlug(slug: string, responses: any) {
    await dbConnect();

    const form = await Form.findOne({ slug, status: 'published' });
    if (!form) throw new Error("Form not found or inactive");

    await Submission.create({
        formId: form._id,
        responses
    });

    return { success: true };
}

export async function getFormBySlug(slug: string) {
    await dbConnect();
    const form = await Form.findOne({ slug, status: 'published' }).lean();
    if (!form) return null;
    return JSON.parse(JSON.stringify(form));
}

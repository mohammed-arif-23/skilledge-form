import dbConnect from "@/lib/mongoose";
import { Form } from "@/models/Form";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        // First, remove existing if any to avoid duplication errors on slug
        await Form.deleteOne({ slug: "elite-students-form" });

        const newForm = await Form.create({
            title: "Elite Students Form",
            description: "Please fill out your details carefully.",
            slug: "elite-students-form",
            status: "published",
            fields: [
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Name of the student",
                    placeholder: "Enter your full name",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Department",
                    placeholder: "e.g., Computer Science and Engineering",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Year / Sec",
                    placeholder: "e.g., III / A",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "radio",
                    label: "Hosteller / Day Scholar",
                    required: true,
                    options: ["Hosteller", "Day Scholar"]
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "If Day Scholar - Bus stage",
                    placeholder: "Enter bus stage (if applicable)",
                    required: false
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Number of arrears",
                    placeholder: "0",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "dropdown",
                    label: "Domain",
                    required: true,
                    options: [
                        "Creative media and visual design",
                        "Video production",
                        "Web development frontend",
                        "Web development backend and database",
                        "UI UX",
                        "Data visualization and analytics",
                        "Cloud and devops",
                        "App development flutter and react native",
                        "AI and Machine learning",
                        "AI automation"
                    ]
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Contact number",
                    placeholder: "Your mobile number",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "WhatsApp number",
                    placeholder: "Your active WhatsApp number",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "email",
                    label: "Domain mail ID",
                    placeholder: "e.g., name@college.edu.in",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Registration number",
                    placeholder: "Your university reg. number",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Class Advisor name",
                    placeholder: "Enter advisor name",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Class Advisor Contact number",
                    placeholder: "Advisor mobile number",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Mentor name",
                    placeholder: "Enter mentor name",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "text",
                    label: "Mentor contact number",
                    placeholder: "Mentor mobile number",
                    required: true
                },
                {
                    id: crypto.randomUUID(),
                    type: "textarea",
                    label: "Your skill set",
                    placeholder: "Eg, web designing, python, etc.",
                    required: true
                }
            ]
        });

        return NextResponse.json({
            success: true,
            message: "Form generated successfully!",
            url: `/form/elite-students-form`,
            form: newForm
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

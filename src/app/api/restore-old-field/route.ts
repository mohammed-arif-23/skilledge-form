import dbConnect from "@/lib/mongoose";
import { Form } from "@/models/Form";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    const form = await Form.findById("69d730106e14c16056a625cb");
    if (!form) {
        return NextResponse.json({ message: "Form not found" });
    }

    const oldExists = form.fields.some((f: any) => f.id === "c74aea7b-b2e7-4643-bd20-1486d1a30cd4");
    if (oldExists) {
        return NextResponse.json({ message: "Old field already exists" });
    }


    const yearIndex = form.fields.findIndex((f: any) => f.id === "994047a8-cb25-4af1-aa2c-286e4a273bff");
    const insertPos = yearIndex !== -1 ? yearIndex : 2;

    form.fields.splice(insertPos, 0, {
        id: "c74aea7b-b2e7-4643-bd20-1486d1a30cd4",
        type: "text",
        label: "Year / Sec (Legacy)",
        placeholder: "e.g., III / A",
        required: false, // Don't require it anymore so it doesn't block future form submits
        options: []
    });

    await form.save();
    return NextResponse.json({ message: "Old field restored" });
}

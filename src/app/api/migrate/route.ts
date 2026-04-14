import dbConnect from "@/lib/mongoose";
import { Form } from "@/models/Form";
import crypto from 'crypto';
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    const form = await Form.findById("69d730106e14c16056a625cb");
    if (!form) {
        return NextResponse.json({ message: "Form not found" });
    }
    const yearSecIndex = form.fields.findIndex((f: any) => f.label === "Year / Sec");
    if (yearSecIndex !== -1) {
        form.fields.splice(yearSecIndex, 1,
            { id: crypto.randomUUID(), type: "dropdown", label: "Year", required: true, options: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
            { id: crypto.randomUUID(), type: "dropdown", label: "Section", required: true, options: ["A", "B", "C", "Nil"] }
        );
        await form.save();
        return NextResponse.json({ message: "Form updated" });
    } else {
        return NextResponse.json({ message: "Field already updated or missing" });
    }
}

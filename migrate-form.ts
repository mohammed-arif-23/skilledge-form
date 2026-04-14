import dbConnect from "./src/lib/mongoose";
import { Form } from "./src/models/Form";
import crypto from 'crypto';

async function run() {
    await dbConnect();
    const form = await Form.findById("69d730106e14c16056a625cb");
    if (!form) {
        console.log("Form not found");
        process.exit();
    }
    const yearSecIndex = form.fields.findIndex((f: any) => f.label === "Year / Sec");
    if (yearSecIndex !== -1) {
        form.fields.splice(yearSecIndex, 1,
            { id: crypto.randomUUID(), type: "dropdown", label: "Year", required: true, options: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
            { id: crypto.randomUUID(), type: "dropdown", label: "Section", required: true, options: ["A", "B", "C", "Nil"] }
        );
        await form.save();
        console.log("Form updated");
    } else {
        console.log("Field already updated or missing");
    }
    process.exit();
}

run();

import dbConnect from "@/lib/mongoose";
import { Submission } from "@/models/Submission";
import { Form } from "@/models/Form";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    const form = await Form.findById("69d730106e14c16056a625cb").lean();
    if (!form) return NextResponse.json({ message: "Form not found" });

    const submissions = await Submission.find({ formId: form._id });
    const oldFieldId = "c74aea7b-b2e7-4643-bd20-1486d1a30cd4"; // Year / Sec
    const newYearId = "994047a8-cb25-4af1-aa2c-286e4a273bff";
    const newSecId = "8b640bce-6eb6-4c44-8695-2b343517b530";

    let updatedCount = 0;

    for (const sub of submissions) {
        if (sub.responses && sub.responses[oldFieldId]) {
            const oldVal = String(sub.responses[oldFieldId]).toLowerCase().trim();
            const s = oldVal.replace(/\s+/g, '');

            let year = "1st Year";
            if (/4(th)?|iv|fourth|\|\|\|\|/i.test(s) || oldVal.includes('2022')) year = "4th Year";
            else if (/3(rd|d)?|iii|third|\|\|\|/i.test(s) || oldVal.includes('2023')) year = "3rd Year";
            else if (/2(nd)?|ii|second|ll|\|\|/i.test(s) || oldVal.includes('2024')) year = "2nd Year";

            let sec = "Nil";
            if (s.includes('a')) sec = "A";
            else if (s.includes('b')) sec = "B";
            else if (s.includes('c')) sec = "C";

            sub.responses[newYearId] = year;
            sub.responses[newSecId] = sec;

            // OPTIONAL: Delete old field so it's clean, but keeping it is fine too.
            // delete sub.responses[oldFieldId];

            sub.markModified('responses');
            await sub.save();
            updatedCount++;
        }
    }

    return NextResponse.json({ message: `Successfully updated ${updatedCount} submissions to use new fields.` });
}

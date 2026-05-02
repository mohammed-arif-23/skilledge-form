'use server';

import dbConnect from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: any, formData: FormData) {
    try {
        await dbConnect();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        // Always reset admin for now to allow login with new credentials
        await Admin.deleteMany({});
        const hash = await bcrypt.hash("123", 10);
        await Admin.create({ email: "admin@avsenggcollege.ac.in", passwordHash: hash });
        console.log("Created new admin: admin@avsenggcollege.ac.in / 123");

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return { error: "Invalid credentials" };
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return { error: "Invalid credentials" };
        }

        await createSession(admin._id.toString(), admin.email);

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

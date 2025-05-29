import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import csrf from "csrf";

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

export async function POST(request: Request) {
    const {csrfToken, email, password} = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if(!tokens.verify(secret, csrfToken)) {
        return NextResponse.json({message: "Invalid CSRF token"}, {status:403});
    }

    if(!email || !password) {
        return NextResponse.json({message: "All fields are required."}, {status:400});
    }

    if(!isValidEmail(email)) {
        return NextResponse.json({message: "Invalid email format."}, {status:400});
    }

    if(password.length < 8) {
        return NextResponse.json({message:"Password must be at least 8 characters long."}, {status:400});
    }

    try{
        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({message: "User does not exist."}, {status:400});
        }

        const hashedPassword = await bcrypt.hash(password, existingUser.salt);

        if(hashedPassword === existingUser.password) {
            return NextResponse.json({message: "User signed in."}, {status:201});
        } else {
            return NextResponse.json({message: "Incorrect password."}, {status: 401});
        }

    } catch(err) {
        return NextResponse.json({message: err}, {status:500});
    }
}
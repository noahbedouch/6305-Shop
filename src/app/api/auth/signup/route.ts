import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';
import csrf from "csrf";

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

export async function POST(request: Request) {
    const {csrfToken, name, email, password, confirmPassword} = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if(!tokens.verify(secret, csrfToken)) {
        return NextResponse.json({message: "Invalid CSRF token"}, {status:403});
    }

    if(!name || !email || !password || !confirmPassword) {
        return NextResponse.json({message: "All fields are required."}, {status:400});
    }

    if(!isValidEmail(email)) {
        return NextResponse.json({message: "Invalid email format."}, {status:400});
    }

    if(confirmPassword !== password) {
        return NextResponse.json({message:"Passwords do not match."}, {status:400});
    }

    if(password.length < 6) {
        return NextResponse.json({message:"Password must be at least 6 characters long."}, {status:400});
    }

    try{
        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({message: "User already exists."}, {status:400});
        }

        const passwordSalt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, passwordSalt);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            salt: passwordSalt
        });

        await newUser.save();
        return NextResponse.json({message: "User Created."}, {status:201});
    } catch(err) {
        return NextResponse.json({message: err}, {status:500});
    }
}
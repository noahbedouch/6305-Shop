import { NextResponse } from "next/server";
import csrf from "csrf";

const tokens = new csrf();
const secret = process.env.CSRF_SECRET || tokens.secretSync();

export async function GET() {
    const token = tokens.create(secret);

    const response = NextResponse.json({ csrfToken: token });

    response.cookies.set("XSRF-TOKEN", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return response;
}
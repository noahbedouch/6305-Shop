'use client'

import axios from "axios";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

const SignIn = () => {
    const[csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get("/api/csrf");
                setCsrfToken(response.data.csrfToken);
                setForm((prev) => ({ ...prev, csrfToken: response.data.csrfToken }));
            } catch(error) {
                console.error("Failed to fetch CSRF token", error);
            }
        };
        fetchCsrfToken();
    }, []);

    const isValidEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
    }

    const [form, setForm] = useState({
        email: "",
        password: "",
        csrfToken,
    })

    const [pending, setPending] = useState(false);
    const [invalid, setInvalid] = useState(true);

    const handleChange = (field: "email" | "password", e: ChangeEvent<HTMLInputElement>) => {
        // Update Form
        const updatedForm = {...form, [field]:e.target.value};

        setForm((updatedForm));
        
        // Validation
        if(updatedForm.email != "" && isValidEmail(updatedForm.email) && updatedForm.password.length > 7) {
            setInvalid(false);
        } else {
            setInvalid(true);
        }
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
    }

    return (
        <div className="flex min-h-screen justify-center items-center bg-[#B9D9EB]">
            <div className="bg-zinc-200 w-[80%] sm:w-[500] h-[425] p-4 sm:p-8 rounded-2xl shadow-elevation-medium flex justify-center">
                <div className="flex flex-col justify-center items-center max-h-full">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                        <h1 className="text-zinc-900 font-bold text-4xl pb-4">Sign In</h1>
                        <input readOnly hidden name="csrfToken" value={form.csrfToken ?? ""}></input>
                        <input type="" placeholder="Email" className="rounded-lg w-[90%] sm:w-[368.5] invalid:outline-red-400 p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-5" onChange={(e) => handleChange("email", e)} value={form.email} disabled={pending} required></input>
                        <input type="password" placeholder="Password" className="rounded-lg w-[90%] sm:w-[368.5] invalid:outline-red-400 p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-12" onChange={(e) => handleChange("password", e)} value={form.password} disabled={pending} required minLength={8}></input>
                        <button className="disabled:bg-slate-500 flex justify-center rounded-lg w-[90%] sm:w-[368.65] h-[68] py-4 bg-[#490843] hover:bg-[#490822] active:bg-slate-900 mb-4" disabled={pending || invalid} onClick={() => {}}>
                            <h1 className="text-3xl text-zinc-200">Sign In</h1>
                        </button>
                        <p className="text-zinc-900 text-xl pt-4">
                            Don&apos;t have an account?
                            <Link className="text-sky-700 ml-2 hover:underline cursor-pointer" href="/auth/sign-up">Sign Up.</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
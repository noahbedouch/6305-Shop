'use client'

import Link from "next/link";
import { useState, useEffect, ChangeEvent, HTMLInputTypeAttribute } from "react"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignUp = () => {

    const router = useRouter();

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
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        csrfToken,
    })
    const [pending, setPending] = useState(false);
    const [invalid, setInvalid] = useState(true);

    const handleChange = (field: "name" | "email" | "password" | "confirmPassword", e: ChangeEvent<HTMLInputElement>) => {
        // Does not update form
        const updatedForm = {...form, [field]:e.target.value};

        setForm((updatedForm));

        // No validation
        if(updatedForm.name != "" && updatedForm.email != "" && isValidEmail(updatedForm.email) && updatedForm.password != "" && updatedForm.confirmPassword != "") {
            if((updatedForm.password == updatedForm.confirmPassword) && (updatedForm.password.length > 7)) {
                setInvalid(false);
            } else {
                setInvalid(true);
            }
        } else {
            setInvalid(true);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })

        if(res?.ok) {
            router.push('/');
        } else if(res?.status === 400) {
            toast.error("Email already in use")
            setPending(false);
        } else {
            toast.error("Something went wrong");
            setPending(false);
        }
    }

    return (
        <div className="bg-[#B9D9EB]">
            <div className="flex min-h-screen justify-center items-center">
                <div className="bg-zinc-200 w-[80%] sm:w-[500] h-[575] p-4 sm:p-8 rounded-2xl shadow-elevation-medium flex justify-center">
                    <div className="flex flex-col justify-center items-center max-h-full">
                        <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                            <h1 className="text-zinc-900 font-bold text-4xl pb-4">Sign Up</h1>
                            <input readOnly hidden name="csrfToken" value={form.csrfToken ?? ""}></input>
                            <input placeholder="Full Name" className="focus:outline-slate-400 invalid:outline-red-400 rounded-lg w-[90%] sm:w-[368.5] p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-5" value={form.name} onChange={(e) => handleChange("name", e)} disabled={pending} required></input>
                            <input placeholder="Email" className="focus:outline-slate-400 invalid:outline-red-400 rounded-lg w-[90%] sm:w-[368.5] p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-5" value={form.email} onChange={(e) => handleChange("email", e)} disabled={pending} required></input>
                            <input minLength={8} type="password" placeholder="Password" className="focus:outline-slate-400 invalid:outline-red-400 rounded-lg w-[90%] sm:w-[368.5] p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-5" value={form.password} onChange={(e) => handleChange("password", e)} disabled={pending} required></input>
                            <input minLength={8} type="password" placeholder="Confirm Password" className="focus:outline-slate-400 invalid:outline-red-400 rounded-lg w-[90%] sm:w-[368.5] p-3 outline-2 outline-slate-300 text-slate-900 text-3xl mb-12" value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e)} disabled={pending} required></input>
                            <button className="flex disabled:bg-slate-500 justify-center rounded-lg w-[90%] sm:w-[368.65] h-[68] py-4 bg-sky-950 hover:bg-[#051f30] active:bg-slate-900 mb-2" disabled={pending || invalid} onClick={() => {}}>
                                <h1 className="text-3xl text-zinc-200">Create Account</h1>
                            </button>
                        </form>
                        <p className="text-zinc-900 text-xl pt-4">
                            Already have an account?
                            <Link className="text-sky-700 ml-2 hover:underline cursor-pointer" href="/auth/sign-in">Sign In.</Link>
                        </p>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default SignUp;
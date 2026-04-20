'use client'

import Link from "next/link"

export default function LoginPage() {
    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        const email = form.get("email");
        const password = form.get("password");

        await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
    }
    return (
        <form action="#" className="flex flex-col justify-center max-w-md mx-auto p-6 space-y-4">
            <h2 className="w-full text-center text-2xl font-semibold">
                Login to your account
            </h2>
            <div>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" className="w-full border p-2" required />
            </div>
            <div>
                <label htmlFor="password">Passoword: </label>
                <input type="password" name="password" className="w-full border p-2" required />
            </div>
            <button className="w-full bg-black text-white border p-2">Login</button>
            <Link href="register" className="hover:text-blue-600 hover:cursor-pointer hover:underline">Have no account? Click here</Link>
        </form>
    )
}
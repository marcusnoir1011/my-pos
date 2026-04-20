'use client'

import Link from "next/link";

export default function LoginPage() {
    async function handleLogin(event) {
        event.preventDefault();

        const data = {
            email: event.target.value,
            password: event.target.value
        };

        console.log(data);
    }

    return (
        <form onSubmit={handleLogin} className="flex flex-col justify-center max-w-md mx-auto p-6 space-y-4">
            <h2 className="w-full text-center text-2xl font-semibold">Login to your account</h2>
            <div>
                <label htmlFor="email">Email: </label>
                <input name="email" type="email"  className="w-full border p-2" />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" className="w-full border p-2" />
            </div>
            <button className="w-full bg-black text-white p-2">Login</button>

            <Link href="register" className="hover:underline">Register a new account.</Link>
        </form>
    )
}
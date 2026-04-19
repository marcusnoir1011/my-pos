'use client'

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
            <h2 className="w-full  text-center text-2xl font-semibold">Login to your account</h2>
            <div>
                <label htmlFor="email">Email: </label>
                <input name="email" type="email"  className="border p-2 w-full" />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" className="border p-2 w-full" />
            </div>
            <button className="bg-black text-white p-2 w-full">Login</button>
        </form>
    )
}
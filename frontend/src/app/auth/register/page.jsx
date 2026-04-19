'use client'

export default function RegisterPage() {
    async function handleRegister(event) {
        event.preventDefault();

        const data = {
            email: event.target.value,
            password: event.target.value
        };

        console.log(data);
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col justify-center max-w-md mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-semibold w-full text-center">Register Your Account</h2>
            <div>
                <label htmlFor="email">Email: </label>
                <input name="email" type="email" className="w-full border p-2" />
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" className="w-full border p-2" />
            </div>

            <button className="w-full bg-black text-white p-2">
                Register
            </button>
        </form>
    )
}
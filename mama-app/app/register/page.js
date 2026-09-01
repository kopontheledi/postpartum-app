"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          username: form.username,
        },
      },
    });

    if (error) {
      console.error("Registration error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("Registration successful:", data);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, Mama ❤️
        </h1>

        <p className="text-gray-600 mb-8">
          Create your account and join our community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border rounded-lg p-3"
          />

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white p-3"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
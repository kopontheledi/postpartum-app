import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-500 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm text-white">Mama App Admin</p>

          <h1 className="text-3xl font-bold">
            Welcome, {profile.full_name} ❤️
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your Mama App content and community.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/articles"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">📚 Articles</h2>
            <p className="mt-2 text-gray-600">
              Create, edit and publish helpful content.
            </p>
          </Link>

          <Link
            href="/admin/topics"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">🌷 Topics</h2>
            <p className="mt-2 text-gray-600">
              Manage postpartum and motherhood topics.
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">🗂️ Categories</h2>
            <p className="mt-2 text-gray-600">
              Organise your app content.
            </p>
          </Link>

          <Link
            href="/admin/community"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">💬 Community</h2>
            <p className="mt-2 text-gray-600">
              Manage Mom Circle posts and comments.
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">👩🏽 Users</h2>
            <p className="mt-2 text-gray-600">
              Manage mothers and community helpers.
            </p>
          </Link>

          <Link
            href="/admin/reports"
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black">🚨 Reports</h2>
            <p className="mt-2 text-gray-600">
              Review reported community content.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-red-300 font-bold">Articles</h1>

            <p className="mt-2 text-gray-600">
              Create and manage Mama App content.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            + New Article
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between border-b p-5 last:border-b-0 text-pink-400"
              >
                <div>
                  <h2 className="font-semibold">{article.title}</h2>

                  <p className="mt-1 text-sm text-pink-300">
                    {article.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-black">
              No articles yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
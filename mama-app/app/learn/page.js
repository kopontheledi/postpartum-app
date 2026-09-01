import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LearnPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, summary, featured, created_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Unable to load articles:", error);
  }

  return (
    <main className="min-h-screen bg-gray-500 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <p className="font-medium">
            Mama Library 🌷
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Learn & Feel Supported
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Helpful information for every stage of your motherhood journey.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">

            {articles.map((article) => (
             <Link
  href={`/learn/${article.slug}`}
  key={article.id}
  className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
>
  {article.featured && (
    <span className="text-sm font-medium">
      🌷 Featured
    </span>
  )}

  <h2 className="mt-2 text-xl font-semibold">
    {article.title}
  </h2>

  <p className="mt-3 text-gray-600">
    {article.summary}
  </p>

  <p className="mt-4 text-sm text-gray-400">
    📅{" "}
    {new Date(
      article.published_at || article.created_at
    ).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </p>

  <p className="mt-5 font-medium">
    Read article →
  </p>
</Link>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-gray-500">
              We're preparing helpful content for you. ❤️
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
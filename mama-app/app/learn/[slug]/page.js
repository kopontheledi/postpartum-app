import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      summary,
      content,
      featured_image_url,
      age_min_months,
      age_max_months,
      featured,
      updated_at,
      published_at
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Article error:", error);
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <article className="mx-auto max-w-3xl">
        <Link href="/learn" className="text-sm text-gray-600">
          ← Back to Mama Library
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm md:p-10">
          {article.featured && (
            <p className="mb-3 text-sm font-medium">🌷 Featured</p>
          )}

          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {article.title}
          </h1>

          {article.summary && (
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {article.summary}
            </p>
          )}

          {(article.age_min_months !== null ||
            article.age_max_months !== null) && (
            <div className="mt-6 inline-block rounded-full bg-gray-100 px-4 py-2 text-sm">
              👶 Baby age: {article.age_min_months ?? 0}
              {" – "}
              {article.age_max_months ?? "12+"} months
            </div>
          )}

          <div className="my-8 border-t" />

          <div className="whitespace-pre-line leading-8 text-gray-700">
            {article.content}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              📅 Published{" "}
              {new Date(
                article.published_at || article.created_at,
              ).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-10 rounded-2xl bg-gray-50 p-5">
            <h2 className="font-semibold">A gentle reminder ❤️</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Mama App provides general educational and community information.
              It does not replace advice, diagnosis or treatment from a
              qualified healthcare professional.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

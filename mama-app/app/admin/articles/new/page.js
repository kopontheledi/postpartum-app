"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    ageMinMonths: "",
    ageMaxMonths: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function createSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function saveArticle(status) {
    setLoading(true);
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Please enter an article title and content.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You must be logged in to create an article.");
      setLoading(false);
      return;
    }

    const slug = createSlug(form.title);

    const { error: insertError } = await supabase
      .from("articles")
      .insert({
        title: form.title.trim(),
        slug,
        summary: form.summary.trim() || null,
        content: form.content.trim(),
        author_id: user.id,

        age_min_months:
          form.ageMinMonths === ""
            ? null
            : Number(form.ageMinMonths),

        age_max_months:
          form.ageMaxMonths === ""
            ? null
            : Number(form.ageMaxMonths),

        featured: form.featured,
        status,
        published_at:
          status === "published"
            ? new Date().toISOString()
            : null,
      });

    if (insertError) {
      console.error(insertError);
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-500 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/articles"
          className="text-sm text-gray-600"
        >
          ← Back to Articles
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Create Article
          </h1>

          <p className="mt-2 text-gray-600">
            Create helpful content for mothers in the Mama community.
          </p>
        </div>

        <div className="mt-8 space-y-6 rounded-2xl border bg-white p-6 shadow-sm">

          <div>
            <label className="mb-2 block font-medium text-black">
              Article title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Breastfeeding: What New Moms Should Know"
              className="w-full rounded-xl border border-black p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Short description
            </label>

            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows="3"
              placeholder="Give moms a short description of this article..."
              className="w-full rounded-xl border border-black p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-black">
              Article content
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="14"
              placeholder="Write your article here..."
              className="w-full rounded-xl border border-black p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-black">
                Minimum baby age
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="ageMinMonths"
                  min="0"
                  value={form.ageMinMonths}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-black p-3 text-black"
                />

                <span className="text-black">
                  months
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-black">
                Maximum baby age
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="ageMaxMonths"
                  min="0"
                  value={form.ageMaxMonths}
                  onChange={handleChange}
                  placeholder="12"
                  className="w-full rounded-xl border border-black p-3 text-black"
                />

                <span className="text-black">
                  months
                </span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            <span className="text-black">Feature this article</span>
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={loading}
              onClick={() => saveArticle("draft")}
              className="rounded-xl border px-5 py-3"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => saveArticle("published")}
              className="rounded-xl bg-black px-5 py-3 text-white"
            >
              {loading ? "Saving..." : "Publish Article"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
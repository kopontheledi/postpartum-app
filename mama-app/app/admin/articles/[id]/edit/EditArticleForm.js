"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditArticleForm({ article, topics }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: article.title || "",
    topicId: article.topic_id || "",
    summary: article.summary || "",
    content: article.content || "",
    ageMinMonths: article.age_min_months ?? "",
    ageMaxMonths: article.age_max_months ?? "",
    featured: article.featured || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
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

  async function updateArticle(status) {
    setLoading(true);
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and article content are required.");
      setLoading(false);
      return;
    }

    const slug = createSlug(form.title);

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        title: form.title.trim(),
        slug,
        summary: form.summary.trim() || null,
        content: form.content.trim(),
        topic_id: form.topicId || null,
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
            ? article.published_at || new Date().toISOString()
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", article.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  async function deleteArticle() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("id", article.id);

    if (deleteError) {
      setError(deleteError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/articles"
          className="text-sm text-gray-600"
        >
          ← Back to Articles
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium">
            Mama CMS 🌷
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Edit Article
          </h1>
        </div>

        <div className="mt-8 space-y-6 rounded-2xl border bg-white p-6">

          <div>
            <label className="mb-2 block font-medium">
              Article title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Topic
            </label>

            <select
              name="topicId"
              value={form.topicId}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select a topic</option>

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.category?.name
                    ? `${topic.category.name} — `
                    : ""}
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Short description
            </label>

            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Article content
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="15"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              min="0"
              name="ageMinMonths"
              value={form.ageMinMonths}
              onChange={handleChange}
              placeholder="Minimum age"
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              min="0"
              name="ageMaxMonths"
              value={form.ageMaxMonths}
              onChange={handleChange}
              placeholder="Maximum age"
              className="rounded-xl border p-3"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            <span>Feature this article 🌷</span>
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={deleteArticle}
              disabled={loading}
              className="rounded-xl border border-red-300 px-5 py-3 text-red-600"
            >
              Delete Article
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateArticle("draft")}
                disabled={loading}
                className="rounded-xl border px-5 py-3"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => updateArticle("published")}
                disabled={loading}
                className="rounded-xl bg-black px-5 py-3 text-white"
              >
                {loading ? "Saving..." : "Update & Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
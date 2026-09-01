"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ArticleForm({ topics }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    topicId: "",
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

  async function saveArticle(status) {
    setError("");

    if (!form.title.trim()) {
      setError("Please enter an article title.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter the article content.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session has expired. Please log in again.");
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

        topic_id:
          form.topicId || null,

        age_min_months:
          form.ageMinMonths === ""
            ? null
            : Number(form.ageMinMonths),

        age_max_months:
          form.ageMaxMonths === ""
            ? null
            : Number(form.ageMaxMonths),

        featured: form.featured,
        author_id: user.id,
        status,

        published_at:
          status === "published"
            ? new Date().toISOString()
            : null,
      });

    if (insertError) {
      console.error(insertError);

      if (insertError.code === "23505") {
        setError(
          "An article with this title already exists. Please use a different title."
        );
      } else {
        setError(insertError.message);
      }

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
            Create Article
          </h1>

          <p className="mt-2 text-gray-600">
            Create helpful content for mothers.
          </p>
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
              placeholder="e.g. Is My Baby Teething?"
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
              <option value="">
                Select a topic
              </option>

              {topics.map((topic) => (
                <option
                  key={topic.id}
                  value={topic.id}
                >
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
              placeholder="What will this article help a mother understand?"
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
              placeholder="Write your article..."
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">
                Minimum baby age
              </label>

              <input
                type="number"
                min="0"
                name="ageMinMonths"
                value={form.ageMinMonths}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Maximum baby age
              </label>

              <input
                type="number"
                min="0"
                name="ageMaxMonths"
                value={form.ageMaxMonths}
                onChange={handleChange}
                placeholder="12"
                className="w-full rounded-xl border p-3"
              />
            </div>

          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            <span>
              Feature this article 🌷
            </span>
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">
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
              {loading
                ? "Saving..."
                : "Publish Article"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
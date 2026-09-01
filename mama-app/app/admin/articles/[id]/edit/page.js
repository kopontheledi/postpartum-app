import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditArticleForm from "./EditArticleForm";

export default async function EditArticlePage({ params }) {
  const { id } = await params;

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

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  const { data: topics } = await supabase
    .from("topics")
    .select(`
      id,
      name,
      category:categories (
        id,
        name
      )
    `)
    .order("name");

  return (
    <EditArticleForm
      article={article}
      topics={topics || []}
    />
  );
}
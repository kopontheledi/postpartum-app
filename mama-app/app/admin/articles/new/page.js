import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleForm from "./ArticleForm";

export default async function NewArticlePage() {
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
    <ArticleForm topics={topics || []} />
  );
}
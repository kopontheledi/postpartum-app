import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {profile?.full_name || "Mama"} ❤️
      </h1>

      <p className="mt-2 text-gray-600">
        You are not alone.
      </p>

      <div className="mt-6">
        <p>
          Username: <strong>{profile?.username}</strong>
        </p>

        <p>
          Role: <strong>{profile?.role}</strong>
        </p>
      </div>
    </main>
  );
}
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/homepage/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default async function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col w-full h-screen bg-background">
        <main className="flex-1 relative">
          {children}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
} 
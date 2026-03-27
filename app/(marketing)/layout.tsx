import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Footer, MarketingNav } from "@/features/marketing";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Redirect authenticated users to the dashboard
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Strict Technical Base: Pure zinc-950 context */}

      <MarketingNav />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

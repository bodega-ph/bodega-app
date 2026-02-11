import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/app/components/auth/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Bodega
        </h1>
        <div className="mt-6 flex flex-col space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">User Session</h2>
            <p className="mt-1 text-slate-900"><strong>Name:</strong> {session?.user?.name}</p>
            <p className="text-slate-900"><strong>Email:</strong> {session?.user?.email}</p>
            <p className="text-slate-900"><strong>Role:</strong> {session?.user?.role || "USER"}</p>
          </div>
          
          <div className="flex justify-end">
            <SignOutButton />
          </div>
        </div>
        <p className="mt-8 text-sm text-slate-500 text-center">
          Tailwind is installed. You can start building inventory features now.
        </p>
      </section>
    </main>
  );
}

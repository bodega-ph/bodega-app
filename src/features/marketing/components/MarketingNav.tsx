import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ChevronDown, Github, MessageSquare } from "lucide-react";

export default async function MarketingNav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1600px] w-full mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left side: Logo + Navigation Links */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-6 h-6 text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                <path
                  d="M5 4h9l6 4.5-4 3.5 4 3.5-6 4.5H5z"
                  strokeWidth="3.5"
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                  className="text-white group-hover:text-indigo-500 transition-colors"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-[0.15em] text-white flex items-center">
              BODEGA
            </span>
          </Link>

          {/* Center Navigation Links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] text-zinc-400 font-medium tracking-tight">
            <Link href="#product" className="hover:text-white transition-colors py-2">
              Product
            </Link>
            <Link href="#docs" className="hover:text-white transition-colors py-2">
              Docs
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors py-2">
              Pricing
            </Link>
            <Link href="#about" className="hover:text-white transition-colors py-2">
              About Us
            </Link>
          </nav>
        </div>

        {/* Right side: Social + Nav actions */}
        <div className="flex items-center gap-6">
          {/* Secondary links */}
          <div className="hidden lg:flex items-center gap-5 text-zinc-400 font-medium text-sm pr-6 border-r border-white/10">
            <Link href="https://github.com" target="_blank" className="hover:text-white transition-colors flex items-center gap-2 group">
              <Github className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors fill-zinc-950 group-hover:fill-white/20" />
            </Link>
          </div>

          {session ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 font-mono text-xs tracking-widest font-bold bg-white text-zinc-950 hover:bg-indigo-500 transition-colors uppercase border border-white hover:border-indigo-500 shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]"
            >
              CONSOLE
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="px-5 py-2 font-mono text-xs tracking-widest font-bold text-white hover:text-indigo-500 bg-transparent border border-white/20 hover:border-indigo-500/50 transition-colors uppercase hidden sm:block"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 font-mono text-xs tracking-widest font-bold bg-white text-zinc-950 hover:bg-indigo-500 transition-colors uppercase border border-white hover:border-indigo-500 shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

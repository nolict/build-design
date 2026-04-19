"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Terminal, Lock, Mail, Loader2 } from "lucide-react";
import BlurText from "@/components/ui/BlurText/BlurText";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090A11] p-4 font-mono">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0c14] via-[#0f1220] to-[#0a0c14]" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <BlurText
            text="ADMIN LOGIN"
            delay={100}
            animateBy="letters"
            direction="top"
            className="text-3xl font-bold tracking-wider text-[#E9F284]"
          />
          <p className="mt-2 text-sm tracking-widest text-white/40">RESTRICTED_ACCESS</p>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#E9F284]/20 bg-[#0A0B14]/80 shadow-2xl backdrop-blur-xl">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-[#E9F284]/10 bg-[#E9F284]/5 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] tracking-widest text-white/30 uppercase">Auth.Session.Initialize</span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                Error: {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] tracking-widest text-[#E9F284]/60 uppercase">Identity</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@build.design"
                  required
                  className="w-full rounded border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white transition-colors placeholder:text-white/20 focus:border-[#E9F284]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] tracking-widest text-[#E9F284]/60 uppercase">Cipher</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-white transition-colors placeholder:text-white/20 focus:border-[#E9F284]/40 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group mt-4 w-full rounded bg-[#E9F284] py-6 font-bold text-[#090A11] transition-all hover:gap-3 hover:bg-[#d8e17b]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Terminal className="h-4 w-4" />
                  <span>EXECUTE_AUTH</span>
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between border-t border-[#E9F284]/10 bg-[#E9F284]/5 px-4 py-2">
            <span className="text-[9px] tracking-tighter text-white/20">SECURE_SHELL_V2</span>
            <span className="text-[9px] font-bold text-[#E9F284]/40">READY</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs tracking-widest text-white/20 transition-colors hover:text-[#E9F284]/60">
            ← RETURN_TO_BASE
          </Link>
        </div>
      </div>
    </div>
  );
}

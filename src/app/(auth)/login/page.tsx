"use client";

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
    <div className="bg-[#090A11] min-h-screen flex items-center justify-center p-4 font-mono">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0c14] via-[#0f1220] to-[#0a0c14]" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <BlurText
            text="ADMIN LOGIN"
            delay={100}
            animateBy="letters"
            direction="top"
            className="text-3xl font-bold tracking-wider text-[#E9F284]"
          />
          <p className="text-white/40 mt-2 text-sm tracking-widest">RESTRICTED_ACCESS</p>
        </div>

        <div className="border border-[#E9F284]/20 bg-[#0A0B14]/80 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="border-b border-[#E9F284]/10 bg-[#E9F284]/5 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-white/30 text-[10px] tracking-widest uppercase">Auth.Session.Initialize</span>
            </div>
          </div>

          <form action={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-red-400 text-xs mb-4">
                Error: {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#E9F284]/60 tracking-widest uppercase ml-1">Identity</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@build.design"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E9F284]/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#E9F284]/60 tracking-widest uppercase ml-1">Cipher</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#E9F284]/40 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E9F284] hover:bg-[#d8e17b] text-[#090A11] font-bold py-6 mt-4 rounded transition-all hover:gap-3 group"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>EXECUTE_AUTH</span>
                </>
              )}
            </Button>
          </form>

          <div className="border-t border-[#E9F284]/10 bg-[#E9F284]/5 px-4 py-2 flex justify-between items-center">
            <span className="text-[9px] text-white/20 tracking-tighter">SECURE_SHELL_V2</span>
            <span className="text-[9px] text-[#E9F284]/40 font-bold">READY</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-white/20 hover:text-[#E9F284]/60 text-xs transition-colors tracking-widest">
            ← RETURN_TO_BASE
          </a>
        </div>
      </div>
    </div>
  );
}

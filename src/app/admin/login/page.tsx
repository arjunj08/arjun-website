"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { BookOpen, KeyRound, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if session is already active (via sessionStorage or simple cookie check)
  // Let the middleware redirect if already logged in, but we can do a soft check.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      let response;

      if (isFirebaseConfigured) {
        // 1. Sign in with Firebase Client SDK
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Fetch the ID token
        const idToken = await user.getIdToken();

        // 3. Post to our Session Cookie creator route
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });
      } else {
        // Fallback: Post credentials directly to the API endpoint
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      }

      if (response.ok) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      // Simplify Firebase error messages
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg("Invalid email or password.");
      } else {
        setErrorMsg(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col justify-center items-center px-4">
      {/* Background radial glowing gradients (cosmic dust style) */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-650/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-650/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Back to Reader button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Book
      </button>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-[#0a0914]/90 border border-[#1b1931] p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10">
        
        {/* Emblem header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-white">Admin Login</h2>
          <p className="text-xs text-stone-400 mt-1">Authenticate to manage "The Living Book"</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
              <input
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#121123] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-stone-400 font-semibold tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121123] border border-[#1b1931] focus:border-indigo-500 focus:outline-none rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-450 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-550 disabled:bg-indigo-850 text-white font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-indigo-600/15 transition-all hover:scale-[1.01] active:scale-99"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

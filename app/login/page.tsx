"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { MOCK_ACCOUNTS } from "@/lib/auth";
import GoogleChooser, { GMark } from "@/components/GoogleChooser";

export default function Login() {
  const { biz, signIn } = useStore();
  const router = useRouter();
  const [chooser, setChooser] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const done = (name: string, mail: string, via: "google" | "email", businessId?: string) => {
    signIn({ name, email: mail, via, businessId });
    router.push("/");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    if (!em || !pw) { setErr("Enter your email and password."); return; }
    const m = MOCK_ACCOUNTS.find((a) => a.email === em);
    if (m) return done(m.name, m.email, "email", m.businessId);
    const b = biz.find((x) => x.ownerEmail?.toLowerCase() === em);
    if (b) return done(b.ownerName ?? "Owner", em, "email", b.id);
    setErr("No account found for that email. Create one instead.");
  };

  return (
    <div className="wrap page">
      <div className="auth">
        <h1>Sign in</h1>
        <p className="sub">Welcome back. Pick up where your business left off.</p>
        <button className="gbtn" onClick={() => setChooser(true)}><GMark />Continue with Google</button>
        <div className="or">or</div>
        <form className="form" onSubmit={submit}>
          <label htmlFor="em">Email</label>
          <input id="em" type="text" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <label htmlFor="pw">Password</label>
          <input id="pw" type="text" value={pw} onChange={(e) => setPw(e.target.value)} />
          {err && <p className="err" role="alert">{err}</p>}
          <div className="actions"><button className="btn" type="submit">Sign in</button></div>
        </form>
        <p className="note">Demo tip: use the Google button, or try wanjiru@temboretail.co.ke with any password.</p>
        <p className="sub">New here? <Link href="/signup"><b>Create a business account</b></Link></p>
      </div>
      {chooser && <GoogleChooser accounts={MOCK_ACCOUNTS} onClose={() => setChooser(false)} onPick={(a) => done(a.name, a.email, "google", a.businessId)} />}
    </div>
  );
}

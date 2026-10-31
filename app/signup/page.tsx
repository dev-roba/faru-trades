"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { NEW_ACCOUNTS } from "@/lib/auth";
import { categories, type Business, type Mode } from "@/lib/data";
import GoogleChooser, { GMark } from "@/components/GoogleChooser";

type Acct = { name: string; email: string; via: "google" | "email" };

export default function Signup() {
  const { register } = useStore();
  const router = useRouter();
  const [acct, setAcct] = useState<Acct | null>(null);
  const [chooser, setChooser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [bn, setBn] = useState("");
  const [cat, setCat] = useState(categories[0]);
  const [city, setCity] = useState("Nairobi");
  const [about, setAbout] = useState("");
  const [st, setSt] = useState("");
  const [price, setPrice] = useState("10000");
  const [days, setDays] = useState("3");
  const [mode, setMode] = useState<Mode>("B2B");

  const step1 = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || pw.length < 6) { setErr("Enter your name, a valid email and a password of 6+ characters."); return; }
    setErr(null); setAcct({ name: name.trim(), email: email.trim().toLowerCase(), via: "email" });
  };

  const step2 = (e: FormEvent) => {
    e.preventDefault();
    if (!acct) return;
    if (!bn.trim() || !city.trim() || !st.trim() || !(+price > 0) || !(+days > 0)) { setErr("Fill in the business name, city and your first service with a price and delivery time."); return; }
    const id = bn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 5);
    const b: Business = {
      id, name: bn.trim(), category: cat, city: city.trim(), verified: false,
      about: about.trim() || `${bn.trim()} is new on Faru Trades.`, rating: 0, jobs: 0,
      ownerName: acct.name, ownerEmail: acct.email,
      services: [{ id: id + "-1", title: st.trim(), blurb: "Listed at sign-up.", price: Math.round(+price), days: Math.round(+days), mode }],
    };
    register(b, { name: acct.name, email: acct.email, via: acct.via });
    router.push("/dashboard");
  };

  return (
    <div className="wrap page">
      <div className="auth">
        {!acct ? (
          <>
            <div className="tag wait">Step 1 of 2</div>
            <h1 style={{ marginTop: 10 }}>Create your account</h1>
            <p className="sub">List your business, get verified and start trading with escrow protection.</p>
            <button className="gbtn" onClick={() => setChooser(true)}><GMark />Sign up with Google</button>
            <div className="or">or</div>
            <form className="form" onSubmit={step1}>
              <label htmlFor="n">Your name</label>
              <input id="n" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <label htmlFor="e">Work email</label>
              <input id="e" type="text" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <label htmlFor="p">Password</label>
              <input id="p" type="text" value={pw} onChange={(e) => setPw(e.target.value)} />
              {err && <p className="err" role="alert">{err}</p>}
              <div className="actions"><button className="btn" type="submit">Continue</button></div>
            </form>
            <p className="sub">Already have an account? <Link href="/login"><b>Sign in</b></Link></p>
          </>
        ) : (
          <>
            <div className="tag wait">Step 2 of 2</div>
            <h1 style={{ marginTop: 10 }}>Your business</h1>
            <p className="sub">Signed in as {acct.name} ({acct.email}) with {acct.via === "google" ? "Google" : "email"}.</p>
            <form className="form" onSubmit={step2}>
              <label htmlFor="bn">Business name</label>
              <input id="bn" type="text" value={bn} onChange={(e) => setBn(e.target.value)} />
              <label htmlFor="cat">Category</label>
              <select id="cat" value={cat} onChange={(e) => setCat(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
              <label htmlFor="city">City</label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              <label htmlFor="ab">About (optional)</label>
              <textarea id="ab" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} />
              <label htmlFor="st">Your first service</label>
              <input id="st" type="text" value={st} onChange={(e) => setSt(e.target.value)} placeholder="e.g. Monthly cleaning contract" />
              <label htmlFor="pr">Price (KSh)</label>
              <input id="pr" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <label htmlFor="dy">Delivery time (days)</label>
              <input id="dy" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
              <label htmlFor="md">Who do you sell to?</label>
              <select id="md" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                <option value="B2B">Businesses (B2B)</option>
                <option value="B2C">Consumers (B2C)</option>
              </select>
              {err && <p className="err" role="alert">{err}</p>}
              <div className="actions"><button className="btn" type="submit">Create business account</button><button className="btn ghost" type="button" onClick={() => setAcct(null)}>Back</button></div>
            </form>
            <p className="note">Your new business starts unverified. Run the verification check in Wallet to lift the KSh 50,000 order cap.</p>
          </>
        )}
      </div>
      {chooser && <GoogleChooser accounts={NEW_ACCOUNTS} onClose={() => setChooser(false)} onPick={(a) => { setChooser(false); setAcct({ name: a.name, email: a.email, via: "google" }); }} />}
    </div>
  );
}

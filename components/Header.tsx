"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businesses, CONSUMER } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0E6B47" />
      <path d="M4 4h6v8H4zM16 4h6v8h-6z" fill="#fff" />
      <path d="M10 16h12v3h-8v2h6v3h-6v5h-4z" fill="#fff" />
    </svg>
  );
}

const links = [["/", "Directory"], ["/orders", "Orders"], ["/dashboard", "Wallet"], ["/economics", "Economics"]];

export default function Header() {
  const path = usePathname();
  const { s, act, biz, account, signOut } = useStore();
  return (
    <header className="top">
      <div className="wrap">
        <Link href="/" className="brand"><Mark />Faru Trades <small>bizz.it</small></Link>
        <nav className="main" aria-label="Main">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <label className="acting">Acting as
          <select value={s.actingAs} onChange={(e) => act(e.target.value)} aria-label="Acting as">
            {biz.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            <option value={CONSUMER.id}>{CONSUMER.name} (B2C)</option>
          </select>
        </label>
        {account ? (
          <div className="auth-box"><span className="auth-name">{account.name}</span><button className="btn sm ghost" onClick={signOut}>Sign out</button></div>
        ) : (
          <div className="auth-box"><Link href="/login" className="btn sm ghost">Sign in</Link><Link href="/signup" className="btn sm">Sign up</Link></div>
        )}
      </div>
    </header>
  );
}

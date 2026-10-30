"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businesses, CONSUMER } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1E6B4F" />
      <path d="M7 22c0-5 3-8 8-8h6l4-6 1 7c1 1 2 3 2 7H7z" fill="#F8FAF6" />
      <path d="M21 14l3-8 1.5 8z" fill="#C4861B" />
      <circle cx="12" cy="19" r="1.3" fill="#1E6B4F" />
    </svg>
  );
}

const links = [["/", "Directory"], ["/orders", "Orders"], ["/dashboard", "Wallet"], ["/economics", "Economics"]];

export default function Header() {
  const path = usePathname();
  const { s, act } = useStore();
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
            {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            <option value={CONSUMER.id}>{CONSUMER.name} (B2C)</option>
          </select>
        </label>
      </div>
    </header>
  );
}
